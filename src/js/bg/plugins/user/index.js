/**
* The User module deals with everything that requires some
* form of authentication.
* @module ModuleUser
*/
const Plugin = require('ca11/lib/plugin')


/**
* Main entrypoint for User.
* @memberof AppBackground.plugins
*/
class PluginUser extends Plugin {
    /**
    * Setup events that can be called upon from `AppForeground`.
    * @param {AppBackground} app - The background application.
    */
    constructor(app) {
        super(app)

        this.app.on('bg:user:account_select', this._selectAccount.bind(this))

        // Other implementation may use other user identifiers than email,
        // that's why the main event uses `username` instead of `email`.
        this.app.on('bg:user:login', (...args) => {
            app.sounds.powerOn.play()
            try {this.login(...args)} catch (err) {console.trace(err)}
        })

        this.app.on('bg:user:logout', (...args) => {
            try {this.logout(...args)} catch (err) {console.trace(err)}
        })

        this.app.on('bg:user:unlock', (...args) => {
            app.sounds.powerOn.play()
            try {this.unlock(...args)} catch (err) {console.trace(err)}
        })

        // this.app.on('bg:user-unlocked', () => {
        //     console.log("PLAY!!!!!!!!!")
        //     app.sounds.powerOn.play()
        // })

        this.app.on('bg:user:set_session', ({session}) => {
            app.changeSession(session)
        })

        this.app.on('bg:user:remove_session', ({session}) => {
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
            identity: {
                privateKey: null,
                publicKey: null,
            },
            status: null,
            username: null,
        }
    }


    /**
    * Placeholder that warns that this method
    * needs to be implemented in the adapter.
    * @param {Object} options - Options to pass.
    * @param {Object} options.account - The account credentials.
    * @param {Function} options.callback - Called when the account is set.
    */
    _selectAccount({account, callback}) {
        this.app.logger.info(`${this}account selection not implemented!`)
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
        this.app.setState({user: {status: 'login'}})
        let sessionName = username
        username = username.split('@')[0]

        userFields = {
            id: shortid.generate(),
        }

        if (this.app.state.app.session.active !== sessionName) {
            // State is reinitialized, but we are not done loading yet.
            let keptState = {user: {status: 'login'}}
            await this.app.changeSession(sessionName, keptState)
        }

        try {
            // Connect to Ca11 backend by initializing network.
            await this.app.__initSession({password})
            this.app._watchersActivate()

            this.app.setState({
                // The `installed` and `updated` flag are toggled off after login.
                app: {installed: false, updated: false},
                ui: {layer: 'calls'},
                user: {username},
            }, {encrypt: false, persist: true})

            await this.app.setState({user: userFields}, {persist: true})
            // Update the state with language presets from the browser if applicable.
            this.app._languagePresets()

        } catch (err) {
            console.error(err)
            this.app.notify({icon: 'warning', message: this.app.$t('failed to login; please check your credentials.'), type: 'warning'})
        } finally {
            this.app.setState({user: {status: null}})
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
        // this.app.plugins.calls.disconnect(false)
        this.app.emit('bg:user:logged_out', {}, true)
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
        this.app.setState({user: {status: 'unlock'}})
        this.app.logger.info(`${this}unlocking session "${username}"`)

        try {
            await this.app.__initSession({password})
            this.app._watchersActivate()
            this.app._languagePresets()
            this.app.setState({ui: {layer: 'calls'}}, {encrypt: false, persist: true})
            this.app.notify({icon: 'contact', message: this.app.$t('your session is unlocked'), type: 'info'})
            this.app.__initServices()
        } catch (err) {
            // Wrong password, resulting in a failure to decrypt.
            this.app.setState({
                ui: {layer: 'login'},
                user: {authenticated: false},
            }, {encrypt: false, persist: true})
            const message = this.app.$t('failed to unlock; check your password')
            this.app.notify({icon: 'warning', message, type: 'danger'})
        } finally {
            this.app.setState({user: {status: null}})
        }
    }
}

module.exports = PluginUser
