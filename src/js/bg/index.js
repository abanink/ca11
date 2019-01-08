/**
* The Background app namespace.
* @namespace AppBackground
*/
const App = require('../lib/app')
const Crypto = require('./lib/crypto')
const Devices = require('./lib/devices')
const Store = require('./lib/store')
const Media = require('../lib/media')
const Sounds = require('../lib/sounds')

const Timer = require('./lib/timer')

/**
* The Ca11 `AppBackground` is a separate running script.
* Functionality that is considered to be part of the backend
* is placed in this context, because this process keeps running
* after the AppForeground (the popup) is closed; at least, when running
* the application as WebExtension. In that sense, this is a typical
* client-server model. When running as a flat webview, the background is
* just as volatile as the foreground, but the same concept and
* code structure is used. The only difference between the
* environments is the involved EventEmitter logic.
*
* @memberof app
*/
class AppBackground extends App {
    /**
    * @param {Object} opts - Options to initialize AppBackground with.
    * @param {Object} opts.env - The environment sniffer.
    * @param {Object} opts.plugins - Plugins to load.
    * @namespace AppBackground.plugins
    */
    constructor(opts) {
        super(opts)

        // Allow context debugging during development.
        // Avoid leaking this global in production mode.
        if (!(process.env.NODE_ENV === 'production')) global.bg = this

        this.store = new Store(this)
        this.crypto = new Crypto(this)
        this.timer = new Timer(this)
        // Encrypted asynchronous writes are queued here.
        this.__writeQueue = []
        // Keep a reference of Vue watchers, so they can be toggled
        // when switching between sessions.
        this._registeredWatchers = []

        // Send the background script's state to the requesting event.
        this.on('bg:get_state', ({callback}) => callback(JSON.stringify(this.state)))
        this.on('bg:refresh_api_data', this._platformData.bind(this))
        // Calls to setState from the foreground.
        this.on('bg:set_state', (...args) => {
            this.__mergeState(...args)
        })

        this.__init()
    }


    /**
    * Send a notification to the user that all its data is removed
    * from the plugin and why. This is used as a quick-and-dirty replacement
    * for migrations when state structure changes between versions. It requires
    * the user to login again.
    * @param {Object} opts - Factory default options.
    * @param {String} opts.title - Notification title.
    * @param {String} opts.message - Notification body.
    */
    __factoryDefaults({title, message}) {
        if (title && message) {
            this.plugins.ui.notification({force: true, message, title})
        }

        this.store.clear()
        this.emit('factory-defaults')
        if (this.env.isBrowser) location.reload()
    }


    async __init() {
        this.__loadPlugins(this.__plugins)
        // The background needs video elements to keep the call alive.
        this.media = new Media(this)
        this.sounds = new Sounds(this)
        await this.__initStore()

        // Clear all state if the schema changed after a plugin update.
        // This is done here because of translations, which are only available
        // after initializing Vue.
        const validSchema = this.store.validSchema()
        let notification = {message: null, title: null}
        // Only send a notification when the schema is already defined and invalid.
        if (validSchema === false) {
            notification.message = this.$t('this update requires you to re-login and setup your account again; our apologies.')
            notification.title = this.$t('database schema changed')
        }

        if (!validSchema) this.__factoryDefaults(notification)
        this.emit('ready')
    }


    /**
    * Load custom platform data and optionally connect to
    * a calling service backend. Only use this method on
    * an authenticated user.
    * @param {Boolean} contacts - Whether to subsribe to Contact Presence.
    */
    __initServices() {
        if (this.state.app.online) {
            this.logger.info(`${this}init platform services`)

            if (this.state.calls.sip.enabled) {
                this.logger.info(`${this}init calling service`)
                this.plugins.calls.connect()
            }

            this.setState({ui: {menubar: {event: null}}})
            this._platformData()
        }
    }


    /**
    * Setup a store for a new or previously stored session.
    * @param {Object} [options] - options.
    * @param {String} [options.key] - The base64 PBKDF2 key to login with.
    * @param {String} [options.password] - The password to unlock the store with.
    */
    async __initSession({key = null, password = null} = {}) {
        let newIdentity = {}
        if (key) {
            this.logger.info(`${this}init session storage with vault key`)
            await this.crypto._importVaultKey(key)
        } else if (password) {
            const sessionId = this.state.app.session.active
            this.logger.debug(`${this}init session identity for "${sessionId}"`)
            Object.assign(newIdentity, await this.crypto.identityCreate(sessionId, password))
        } else {
            throw new Error('failed to unlock (no session key or credentials)')
        }

        await this._restoreState()

        // Either restore the user identity from the previously stored
        // state, store the created identity into the state.
        if (key) {
            await this.crypto.identityImport(this.state.user.identity)
        } else if (password) {
            this.setState({user: {identity: newIdentity}}, {persist: true})
        }

        this.setState({
            app: {vault: {unlocked: true}},
            user: {authenticated: true},
        }, {encrypt: false, persist: true})

        this.plugins.calls.sig11.connect()


        // Set the default layer if it's still set to login.
        if (this.state.ui.layer === 'login') {
            this.setState({ui: {layer: 'calls'}}, {encrypt: false, persist: true})
        }

        // Store the vault key on login when the setting is on,
        //but the key is not there yet.
        const vault = this.state.app.vault
        if (vault.store && !vault.key) {
            await this.crypto.storeVaultKey()
        }

        this.emit('bg:user-unlocked', {}, 'both')
    }



    /**
    * Load store defaults and restore the encrypted state from
    * localStorage, if the session can be restored immediately.
    * Load a clean state from defaults otherwise. Then initialize
    * the ViewModel and check for the data schema. Do a factory reset
    * if the data schema is outdated.
    */
    async __initStore() {
        this.logger.info(`${this}init state store`)
        super.__initStore()
        await this.changeSession('active')
        // The vault always starts in a locked position.
        this.setState({
            app: {vault: {unlocked: false}},
            ui: {menubar: {base: 'inactive', event: null}},
        })

        if (this.state.app.vault.key) {
            this.logger.info(`${this}opening session '${this.state.user.username}'...`)
            await this.__initSession({key: this.state.app.vault.key})
            // (!) State is reactive after initializing the view-model.
            this.__initViewModel({main: null})
            this._watchersActivate()
            this.__initServices()

        } else {
            // No session yet.
            this.__initViewModel({main: null})
        }

        this.devices = new Devices(this)

        // Signal all plugins that AppBackground is ready to go.
        for (let module of Object.keys(this.plugins)) {
            if (this.plugins[module]._ready) this.plugins[module]._ready()
        }
    }


    /**
    * This operation applies the state update and processes unencrypted
    * writes immediately; these can be done synchronously. Encrypted store
    * writes are deferred to a write queue, which are handled from
    * the `__queueNextTick` event-loop.
    * @param {Object} options - See the parameter description of super.
    * @returns {null|Promise} - Encrypt operation returns a Promise.
    */
    async __mergeState({action = 'upsert', encrypt = true, path = null, persist = false, state}) {
        const storeEndpoint = this.state.app.session.active
        // This could happen when an action is still queued, while the user
        // is logging out at the same moment. The action is then ignored.
        if (persist && !storeEndpoint) {
            return null
        }

        // Apply the state change to the active store.
        super.__mergeState({action, encrypt, path, persist, state})
        if (!persist) return null

        // Apply the changes to the cached store.
        let storeState
        if (!encrypt) storeState = this.store.cache.unencrypted
        else storeState = this.store.cache.encrypted

        super.__mergeState({action, encrypt, path, persist, source: storeState, state})

        // We can safely write synchronously to localstorage.
        if (!encrypt) {
            this.store.set(`${storeEndpoint}/state`, storeState)
            return null
        }

        // The encrypted write action is deferred to writing a snapshot
        // from a queue. All async write actions still need to be
        // processed in order.
        const frozenState = this.utils.copyObject(storeState)
        return new Promise((resolve, reject) => {
            this.__writeQueue.push({
                action: (item) => this.__writeEncryptedState({item, reject, resolve, state: frozenState}),
                status: 0,
            })

            this.__processWriteQueue()
        })
    }


    __processWriteQueue() {
        if (this.__writeQueue.length) {
            // Only fire an action once per call.
            let actionStarted = false
            for (const item of this.__writeQueue) {
                if (item.status === 0 && !actionStarted) {
                    actionStarted = true
                    item.action(item)
                } else if (this.__writeQueue[0].status === 2) {
                    this.__writeQueue.shift()
                }
            }
        }
    }


    /**
    * This function is kept in an array and is processed like
    * a queue. The queue determines whether the next item can
    * be processed by checking the item status.
    * @param {Object} options - The options to pass.
    */
    async __writeEncryptedState({item, reject, resolve, state}) {
        item.status = 1
        const storeEndpoint = this.state.app.session.active
        if (!storeEndpoint) return

        let storeState = await this.crypto.encrypt(this.crypto.sessionKey, JSON.stringify(this.store.cache.encrypted))
        this.store.set(`${storeEndpoint}/state/vault`, storeState)
        item.status = 2
        // Process the next queue item in case other write actions were
        // added in the meantime.
        resolve()
        this.__processWriteQueue()
    }


    /**
    * Each background module can use a `_platformData` implementation
    * to update their store properties at certain points in the application.
    * This is called at the start after login and when using the refresh
    * option.
    */
    async _platformData() {
        this.logger.info(`${this}<platform> refreshing all data`)
        const platformDataPlugins = Object.keys(this.plugins).filter((m) => this.plugins[m]._platformData)
        try {
            const dataRequests = platformDataPlugins.map((m) => this.plugins[m]._platformData())
            await Promise.all(dataRequests)
        } catch (err) {
            // Network changed in the meanwhile or a timeout error occured.
            this.logger.warn(err)
        }
    }


    /**
    * The stored state is separated between two serialized JSON objects
    * in localStorage. One is for encrypted data, and the other for
    * unencrypted data. When the application needs to retrieve its state
    * from storage, this method will restore the combined state
    * and applies module-specific state changes. See for instance the
    * _restoreState implementation in the Contacts module for a more
    * complicated example.
    */
    async _restoreState() {
        const sessionId = this.state.app.session.active

        let unencryptedState = this.store.get(`${sessionId}/state`)
        if (!unencryptedState) {
            throw new Error(`${this}state store for session not found: '${sessionId}'`)
        }

        this.store.cache.unencrypted = unencryptedState

        // Determine if there is an encrypted state vault.
        let cipherData = this.store.get(`${sessionId}/state/vault`)
        let decryptedState = {}
        if (cipherData) {
            try {
                decryptedState = JSON.parse(await this.crypto.decrypt(this.crypto.sessionKey, cipherData))
            } catch (err) {
                this.logger.debug(`${this}failed to restore encrypted state`)
                throw new Error('failed to decrypt; wrong password?')
            }

            this.logger.debug(`${this}restored encrypted vault session ${sessionId}`)
        } else decryptedState = {}
        this.store.cache.encrypted = decryptedState

        let state = {}
        this.__mergeDeep(state, decryptedState, unencryptedState)

        for (let module of Object.keys(this.plugins)) {
            if (this.plugins[module]._restoreState) {
                // Nothing persistent in this module yet. Assume an empty
                // object to start with.
                if (!state[module]) state[module] = {}
                this.plugins[module]._restoreState(state[module])
            }
        }
        this.logger.debug(`${this}restore state of session "${sessionId}"`)
        await this.setState(state)
    }


    /**
    * App-wide store property watchers.
    * @returns {Object} - Watched store properties.
    */
    _watchers() {
        return {
            /**
            * Watch for language changes.
            * @param {Object} languageId - The new language.
            */
            'store.language.selected.id': (languageId) => {
                this.logger.info(`${this} setting language to ${languageId}`)
                Vue.i18n.set(languageId)
            },
        }
    }


    _watchersActivate() {
        this.logger.info(`${this}init store watchers...`)
        let watchers = this._watchers()

        for (let module of Object.keys(this.plugins)) {
            if (this.plugins[module]._watchers) {
                Object.assign(watchers, this.plugins[module]._watchers())
            }
        }

        for (const key of Object.keys(watchers)) {
            this._registeredWatchers.push(this.vm.$watch(key, watchers[key]))
        }
    }


    _watchersDeactivate() {
        this.logger.info(`${this}deactivating ${this._registeredWatchers.length} store watchers`)
        for (const unwatch of this._registeredWatchers) unwatch()
        this._registeredWatchers = []
    }


    /**
    * Reboot a session with a clean state. It can be used
    * to load a specific previously stored session, or to
    * continue the session that should be active or to
    * start a `new` session.
    * @param {String} sessionId - The identifier of the session.
    * @param {Object} keptState - State that needs to survive.
    * @returns {String} - The session id that is going to be used.
    */
    async changeSession(sessionId, keptState = {}, {logout = false} = {}) {
        // The store cache must be emptied when switching sessions,
        // otherwise unwanted state will leak into other sessions.
        this.store.cache.encrypted = {}
        // Find sessions from LocalStorage.
        let session = this.store.findSessions()

        if (sessionId === 'active') {
            sessionId = session.active ? session.active : null
        }

        if (logout) {
            this.setState({
                app: {vault: {key: null, unlocked: false}},
                user: {authenticated: false},
            }, {encrypt: false, persist: true})
            this.store.cache.unencrypted = {}
        }

        this.logger.debug(`${this}switch to session "${sessionId}"`)
        // Disable all watchers while switching sessions.
        if (this._registeredWatchers.length) this._watchersDeactivate()

        // Overwrite the current state with the initial state.
        this.__mergeDeep(this.state, this.__mergeDeep(this._initialState(), keptState))

        session.active = sessionId
        this.setState({app: {session}})

        // Copy the unencrypted store of an active session to the state.
        if (sessionId && sessionId !== 'new') {
            this.__mergeDeep(this.state, this.store.get(`${sessionId}/state`))
            // Always pin these presets, no matter what the stored setting is.
            if (this.state.app.vault.key) {
                this.state.app.vault.unlocked = true
            } else {
                this.state.app.vault.unlocked = false
            }
            this.plugins.ui.menubarState()
            Object.assign(this.state.user, {authenticated: false, username: sessionId})
        }

        // Set the info of the current sessions in the store again.
        await this.setState(this.state)

        this.plugins.ui.menubarState()
        return sessionId
    }


    /**
    * Remove a session with a clean state.
    * @param {String} sessionId - The identifier of the session.
    */
    removeSession(sessionId) {
        this.logger.info(`${this}removing session "${sessionId}"`)
        this.store.remove(`${sessionId}/state`)
        this.store.remove(`${sessionId}/state/vault`)
        this.changeSession(null)
    }


    /**
    * Set the state within the own running script context
    * and then propagate the state to the other logical
    * endpoint for syncing.
    * @param {Object} state - The state to update.
    * @param {Boolean} options - Whether to persist the changed state to localStorage.
    */
    async setState(state, {action, encrypt, path, persist = false} = {}) {
        if (!action) action = 'upsert'
        // Merge state in the context of the executing script.
        if (!encrypt) this.__mergeState({action, encrypt, path, persist, state})
        else await this.__mergeState({action, encrypt, path, persist, state})
        // Sync the state to the other script context(bg/fg).
        // Make sure that we don't pass a state reference over the
        // EventEmitter in case of a webview; this would create
        // unpredicatable side-effects.
        let stateClone = state
        if (!this.env.isExtension) stateClone = JSON.parse(JSON.stringify(state))
        this.emit('fg:set_state', {action, encrypt, path, persist, state: stateClone})
        return
    }


    /**
    * Generate a representational name for this module. Used for logging.
    * @returns {String} - An identifier for this module.
    */
    toString() {
        return '[bg] '
    }
}


const options = require('./lib/options')

if (options.env.isBrowser) {

    if (options.env.isExtension) {
        Raven.context(function() {
            this.bg = new AppBackground(options)
        })
    } else {
        global.AppBackground = AppBackground
        global.bgOptions = options
    }
} else {
    // Help modules find the ca11 module alias from package.json
    module.exports = {AppBackground, options}
}
