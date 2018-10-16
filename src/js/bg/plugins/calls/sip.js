class SipCalls {

    constructor(callsPlugin) {
        this.app = callsPlugin.app
        this.plugin = callsPlugin
    }


    /**
    * Deal with events coming from a UA.
    */
    __uaEvents() {
        /**
        * An incoming call. Call-waiting is not implemented.
        * A new incoming call on top of a call that is already
        * ongoing will be silently terminated.
        */
        this.ua.on('invite', (session) => {
            this.app.logger.debug(`${this}<event:invite>`)
            const callIds = Object.keys(this.plugin.calls)
            const callOngoing = this.app.helpers.callOngoing()
            const closingCalls = this.app.helpers.callsClosing()
            const deviceReady = this.app.state.settings.webrtc.devices.ready
            const dnd = this.app.state.availability.dnd
            const microphoneAccess = this.app.state.settings.webrtc.media.permission

            let acceptCall = true
            let declineReason
            if (dnd || !microphoneAccess || !deviceReady) {
                acceptCall = false
                if (dnd) declineReason = 'dnd'
                if (!microphoneAccess) declineReason = 'microphone'
                if (!deviceReady) declineReason = 'device'
            }

            if (callOngoing) {
                // All ongoing calls are closing. Accept the call.
                if (callIds.length === closingCalls.length) {
                    acceptCall = true
                } else {
                    // Filter non-closing calls from all Call objects.
                    const notClosingCalls = callIds.filter((i) => !closingCalls.includes(i))
                    // From these Call objects, see which ones are not `new`.
                    const notClosingNotNewCalls = notClosingCalls.filter((i) => this.plugin.calls[i].state.status !== 'new')

                    if (notClosingNotNewCalls.length) {
                        acceptCall = false
                        declineReason = 'call ongoing'
                    } else acceptCall = true
                }
            }

            if (acceptCall) {
                // An ongoing call may be a closing call. In that case we first
                // remove all the closing calls before starting the new one.
                for (const callId of closingCalls) {
                    this.app.logger.debug(`${this}deleting closing call ${callId}.`)
                    this.deleteCall(this.plugin.calls[callId])
                }
            }
            // A declined Call will still be initialized, but as a silent
            // Call, meaning it won't notify the user about it.
            const call = this.plugin.callFactory(session, {silent: !acceptCall}, 'CallSIP')
            this.plugin.calls[call.id] = call
            call.start()

            if (!acceptCall) {
                this.app.logger.info(`${this}incoming call ${session.request.call_id} denied by invite handler: (${declineReason})`)
                call.terminate()
            } else {
                this.app.logger.info(`${this}incoming call ${session.request.call_id} allowed by invite handler`)
                Vue.set(this.app.state.calls.calls, call.id, call.state)
                this.app.emit('fg:set_state', {action: 'upsert', path: `calls.calls.${call.id}`, state: call.state})
            }
        })


        this.ua.on('registered', () => {
            this.app.logger.debug(`${this}<event:registered>`)
            if (this.__registerPromise) {
                this.__registerPromise.resolve()
                delete this.__registerPromise
            }
            this.app.setState({calls: {sip: {status: 'registered'}}})
            this.app.emit('calls:registered', {}, true)
        })


        this.ua.on('registrationFailed', () => {
            this.app.logger.debug(`${this}<event:registrationFailed>`)
            if (this.__registerPromise) {
                this.__registerPromise.reject()
                this.disconnect()
                delete this.__registerPromise
            }
            this.app.setState({calls: {sip: {status: 'registration_failed'}}})
        })


        this.ua.on('unregistered', () => {
            this.app.logger.debug(`${this}<event:unregistered>`)
            this.app.setState({calls: {sip: {status: this.ua.transport.isConnected() ? 'connected' : 'disconnected'}}})
        })

        this.ua.on('transportCreated', (transport) => {
            this.app.logger.debug(`${this}<event:transportCreated>`)

            this.ua.transport.on('connected', () => {
                this.app.logger.debug(`${this}<event:connected>`)
                // Reset the retry interval timer..
                this.retry = Object.assign({}, this.retryDefault)
                this.app.emit('calls:connected', {}, true)
            })

            this.ua.transport.on('disconnected', () => {
                this.app.logger.debug(`${this}<event:disconnected>`)

                this.app.setState({calls: {sip: {status: 'disconnected'}}})

                this.retry = Object.assign({}, this.retryDefault)
                this.reconnect = false

                // We don't use SIPJS reconnect logic, because it can't deal
                // with offline detection and incremental retry timeouts.
                if (this.reconnect) {
                    // Reconnection timer logic is performed only here.
                    this.app.logger.debug(`${this}reconnect in ${this.retry.timeout} ms`)
                    setTimeout(() => {
                        this.connect({register: this.app.state.settings.webrtc.enabled})
                    }, this.retry.timeout)
                    this.retry = this.app.timer.increaseTimeout(this.retry)
                }
            })
        })
    }


    /**
    * Setup the initial UA options.
    * @returns {Object} UA options that are passed to Sip.js
    */
    __uaOptions() {
        let options = {
            autostart: false,
            autostop: false,
            log: {
                builtinEnabled: true,
                level: 'error',
            },
            // Incoming unanswered calls are terminated after x seconds.
            noanswertimeout: 60,
            sessionDescriptionHandlerFactoryOptions: {
                constraints: {
                    audio: true,
                    video: false,
                },
                peerConnectionOptions: {
                    rtcConfiguration: {
                        iceServers: this.app.state.settings.webrtc.stun.map((i) => ({urls: i})),
                    },
                },
            },
            traceSip: false,
            transportOptions: {
                // Reconnects are handled manually.
                maxReconnectionAttempts: 0,
                // Don't allow unencrypted websocket connections.
                wsServers: `wss://${this.app.state.calls.sip.endpoint}`,
            },
            userAgentString: this._userAgent(),
        }

        options.password = this.app.state.calls.sip.account.selected.password
        options.authorizationUser = this.app.state.calls.sip.account.selected.username
        options.uri = `${options.authorizationUser}@${this.app.state.calls.sip.endpoint}`
        options.register = true
        return options
    }


    /**
    * Build the useragent to identify Ca11 with.
    * The format is `Ca11/<VERSION> (<OS/<ENV>) <Vendor>`.
    * Don't change this string lightly since third-party
    * applications depend on it.
    * @returns {String} - Useragent string.
    */
    _userAgent() {
        const env = this.app.env
        // Don't use dynamic extension state here as version.
        // Ca11 may run outside of an extension's (manifest)
        // context. Also don't use template literals, because envify
        // can't deal with string replacement otherwise.
        let userAgent = 'Ca11/' + process.env.VERSION + ' '
        if (env.isLinux) userAgent += '(Linux/'
        else if (env.isMacOS) userAgent += '(MacOS/'
        else if (env.isWindows) userAgent += '(Windows/'

        if (env.isChrome) userAgent += 'Chrome'
        if (env.isElectron) userAgent += 'Electron'
        else if (env.isFirefox) userAgent += 'Firefox'
        else if (env.isEdge) userAgent += 'Edge'
        userAgent += `) ${this.app.state.app.vendor.name}`
        return userAgent
    }


    async connect() {
        this.app.logger.info(`${this}connect to SIP service`)
        // The default is to reconnect.
        this.reconnect = true

        this._uaOptions = this.__uaOptions()

        // Overwrite the existing instance with a new one every time.
        // SIP.js doesn't handle resetting configuration well.
        this.ua = new SIP.UA(this._uaOptions)
        this.__uaEvents()
        this.ua.start()
    }


    /**
    * Graceful stop, do not reconnect automatically.
    * @param {Boolean} reconnect - Whether try to reconnect.
    */
    disconnect(reconnect = true) {
        this.app.logger.info(`${this}disconnect ua (reconnect: ${reconnect ? 'yes' : 'no'})`)
        this.reconnect = reconnect
        this.retry.timeout = 0

        this.app.setState({calls: {sip: {status: reconnect ? 'loading' : null}}})
        this.ua.unregister()
        this.ua.transport.disconnect()
        this.ua.transport.disposeWs()
        if (reconnect) {
            this.connect()
        }
    }



    /**
    * Generate a representational name for this module. Used for logging.
    * @returns {String} - An identifier for this module.
    */
    toString() {
        return `${this.app}[calls][sig11] `
    }
}

module.exports = SipCalls
