/**
* Session plugin controls personal preferences.
* @memberof CA11.plugins
*/
class PluginSession extends Plugin {
    /**
    * Setup events that can be called upon from `AppForeground`.
    * @param {AppBackground} app - The background application.
    */
    constructor(app) {
        super(app)

        // Other implementation may use other user identifiers than email,
        // that's why the main event uses `username` instead of `email`.
        this.app.on('session:start', (...args) => {
            app.sounds.powerOn.play()
            this.login(...args)
        })

        this.app.on('session:close', (...args) => {
            this.logout(...args)
        })

        this.app.on('session:unlock', (...args) => {
            app.sounds.powerOn.play()
            this.unlock(...args)
        })

        this.app.on('session:select', ({session}) => {
            app.changeSession(session)
        })

        this.app.on('session:destroy', ({session}) => {
            app.removeSession(session)
        })
    }


    /**
    * Initializes the module's store.
    * @returns {Object} The module's store properties.
    */
    _initialState() {
        return {
            authenticated: false,
            developer: false,
            status: null,
            username: null,
        }
    }


    /**
    * Some default actions that are done, no matter
    * what login provider is being used.
    * @param {Object} options - Options to pass.
    * @param {String} options.password - The password that is used to unlock a session.
    * @param {String} options.userFields - The fields that the particular user requires.
    * @param {String} options.username - The username the user is identified with.
    */
    async login({password, userFields, username}) {
        this.app.setState({session: {status: 'login'}})
        let sessionName = username
        username = username.split('@')[0]

        userFields = {
            id: shortid.generate(),
        }

        if (this.app.state.app.session.active !== sessionName) {
            // State is reinitialized, but we are not done loading yet.
            let keptState = {session: {status: 'login'}}
            await this.app.changeSession(sessionName, keptState)
        }

        try {
            // Connect to Ca11 backend by initializing network.
            await this.app.__initSession({password})
            this.app._watchersActivate()

            this.app.setState({
                // The `installed` and `updated` flag are toggled off after login.
                app: {installed: false, updated: false},
                session: {username},
                ui: {layer: 'caller'},
            }, {encrypt: false, persist: true})

            await this.app.setState({session: userFields}, {persist: true})
            // Update the state with language presets from the browser if applicable.
            this.app._languagePresets()

        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err)
            this.app.notify({icon: 'warning', message: this.app.$t('failed to login; please check your credentials.'), type: 'warning'})
        } finally {
            this.app.media.query()
            this.app.setState({session: {status: null}})
        }
    }


    /**
    * Remove any stored session key, but don't delete the salt.
    * This will render the cached and stored state useless.
    */
    async logout() {
        this.app.logger.info(`${this}logging out and cleaning up state`)
        this.app._watchersDeactivate()
        await this.app.changeSession(null, {}, {logout: true})

        // Disconnect without reconnect attempt.
        this.app.plugins.calls.disconnect(false)
        this.app.media.stop()
        this.app._languagePresets()
    }


    /**
    * Generate a representational name for this module. Used for logging.
    * @returns {String} - An identifier for this module.
    */
    toString() {
        return `${this.app}[user] `
    }


    /**
    * This method is called when the correct session is already
    * selected. No need to change sessions again.
    */
    async unlock({username, password}) {
        this.app.setState({session: {status: 'unlock'}})
        this.app.logger.info(`${this}unlocking session "${username}"`)

        try {
            await this.app.__initSession({password})
            this.app._watchersActivate()
            this.app._languagePresets()
            this.app.setState({ui: {layer: 'caller'}}, {encrypt: false, persist: true})
            this.app.notify({icon: 'contact', message: this.app.$t('welcome back {username}', {username}), type: 'info'})
            this.app.__initServices()
        } catch (err) {
            // Wrong password, resulting in a failure to decrypt.
            this.app.setState({
                session: {authenticated: false},
                ui: {layer: 'session'},
            }, {encrypt: false, persist: true})
            const message = this.app.$t('failed to unlock; check your password')
            this.app.notify({icon: 'warning', message, type: 'danger'})
        } finally {
            this.app.media.query()
            this.app.setState({session: {status: null}})
        }
    }
}

module.exports = PluginSession
