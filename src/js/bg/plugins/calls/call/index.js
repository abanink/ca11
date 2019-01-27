/**
* @module ModuleCalls
*/

/**
 * Base Call class that each implementation of a Call must use.
 * Currently used by CallConnectAB and CallSIP.
 */
class Call {
    /**
     * Initialize a new Call object by setting up some Call sounds
     * and set initial state. This state is shared by the UI of
     * AppForeground and the backend of AppBackground.
     * @param {AppBackground} app - The background application.
     * @param {String} description - An endpoint description to call.
     * @param {Object} [options] - New Call options.
     * @param {Boolean} [options.active] - Activate this Call in the UI.
     * @param {Boolean} [options.silent] - Setup Call without notifying the UI.
     */
    constructor(app, description, {active, silent} = {}) {
        this.app = app
        this.plugin = app.plugins.calls
        this.silent = silent
        // References to MediaStream objects related to this call.
        this.streams = {}
        this._started = false

        this.busyTone = app.sounds.busyTone
        this.translations = app.helpers.getTranslations().call


        this.id = shortid.generate()
        /**
         * @property {Object} state - Reactive computed properties from Vue-stash.
         * @property {Boolean} state.active - Whether the Call shows in the UI or not.
         * @property {String} state.class - Used to identify the Call type with.
         * @property {String} state.displayName - The name to show when calling.
         * @property {String} state.endpoint - The Call's endpoint identifier.
         * @property {Object} state.hangup - Specifies the hangup feature of a Call.
         * @property {Object} state.hold - Specifies the hold feature of a Call.
         * @property {String} state.id - The generated UUID of the Call.
         * @property {Object} state.keypad - Whether the type of Call supports a keypad feature.
         * @property {String} state.protocol - Protocol that the Call uses.
         * @property {String} state.status - A Call state identifier as described in `this._statusMap`.
         * @property {Object} state.timer - Keeps track of the Call time.
         * @property {Object} state.transfer - Specifies the transfer feature of a Call.
         * @property {String} state.type - Either `incoming` or `outgoing`.
         */
        this.state = {
            active: false,
            class: this.constructor.name,
            displayName: null,
            endpoint: null,
            hangup: {
                disabled: false,
            },
            hold: {
                active: false,
                disabled: false,
            },
            id: this.id,
            keypad: {
                active: false,
                disabled: false,
                endpoint: null,
            },
            mute: {
                active: false,
            },
            protocol: 'unknown',
            stats: {
                callId: null,
            },
            status: null,
            streams: {},
            timer: {
                current: null,
                start: null,
            },
            transfer: {
                active: false,
                disabled: false,
                type: 'attended',
            },
            type: null, // incoming or outgoing
        }

        // The default Call status codes, which each Call implementation should map to.
        this._statusMap = {
            accepted: 'accepted',
            answered_elsewhere: 'answered_elsewhere',
            bye: 'bye',
            callee_busy: 'callee_busy',
            callee_unavailable: 'callee_unavailable',
            create: 'create',
            invite: 'invite',
            request_terminated: 'request_terminated',
        }
    }


    /**
     * Remove a track that is ended from remote.
     * @param {MediaStreamTrack} streamId - Id of the stream to clean up.
     */
    _cleanupStream(streamId) {
        const path = `calls.calls.${this.id}.streams.${streamId}`
        this.app.setState(null, {action: 'delete', path})
        delete this.app.media.streams[streamId]
    }


    /**
     * Generic UI and state-related logic for an outgoing call.
     * Note: first set the endpoint and displayName in the parent,
     * before calling this super.
     */
    _incoming() {
        this.setState(this.state)
        // Signal the user about the incoming call.
        if (!this.silent) {
            this.app.setState({ui: {layer: 'calls', menubar: {event: 'ringing'}}})

            this.app.plugins.ui.notification({
                endpoint: this.state.endpoint,
                message: `${this.state.endpoint}: ${this.state.displayName}`,
                title: this.translations.invite,
            })

            this.app.sounds.ringTone.play({loop: true})
            this.plugin.activateCall(this, true)
        }
    }


    /**
     * Add two video elements to the DOM of AppBackground and get the
     * permission to the microphone. This permission is already granted
     * from the fg script. Addding the video elements to the bg DOM
     * allows us to keep the Call stream active after the popup is closed.
     */
    async _initSinks() {
        // Set the output device from settings.
        let outputSink
        const devices = this.app.state.settings.webrtc.devices
        if (devices.speaker.enabled) outputSink = devices.sinks.speakerOutput.id
        else outputSink = devices.sinks.headsetOutput.id

        this.app.logger.debug(`${this}change sink of remote video element to ${outputSink}`)
        // Chrome Android doesn't have setSinkId.
        if (this.app.media.fallback.remote.setSinkId) {
            try {
                await this.app.media.fallback.remote.setSinkId(outputSink)
            } catch (err) {
                const message = this.app.$t('failed to set output device!')
                this.app.notify({icon: 'warning', message, type: 'danger'})
                // eslint-disable-next-line no-console
                console.error(err)
            }
        }
    }


    /**
     * Some UI state plumbing to setup an outgoing Call.
     */
    _outgoing() {
        // Try to fill in the displayName from contacts.
        const contacts = this.app.state.contacts.contacts
        let displayName = ''
        for (const id of Object.keys(contacts)) {
            if (contacts[id].endpoint === parseInt(this.endpoint)) {
                displayName = contacts[id].name
            }
        }

        // Always set this call to be the active call.
        this.plugin.activateCall(this, true)
        let message = ''
        if (displayName) {
            message = `${this.state.endpoint}: ${displayName}`
        } else {
            message = this.state.endpoint
        }

        this.app.plugins.ui.notification({endpoint: this.state.endpoint, message, title: this.translations.create})
        this.setState({displayName: displayName, status: this._statusMap.create})

        if (!this.silent) {
            this.app.setState({ui: {layer: 'calls', menubar: {event: 'ringing'}}})
        }
    }


    /**
     * Handle UI-related logic when a Call is started; both for
     * incoming and outgoing calls.
     * @param {Object} options - Options to pass to _start.
     * @param {Number} options.timeout - Postpones resetting the call state.
     * @param {Boolean} options.force - Force showing a notification.
     * @param {String} [options.message] - Force a notification message.
     */
    _start({force = false, message = ''}) {
        // A silent Call doesn't need to do anything here.
        if (this.silent) return

        if (!message) {
            message = this.state.endpoint
            if (this.state.displayName) message += `:${this.state.displayName}`
        }
        this._started = true
        this.app.sounds.ringbackTone.stop()
        this.app.sounds.ringTone.stop()

        this.setState({
            status: 'accepted',
            timer: {
                current: new Date().getTime(),
                start: new Date().getTime(),
            },
        })

        const title = this.translations.accepted[this.state.type]
        this.app.plugins.ui.notification({endpoint: this.state.endpoint, force, message, title})

        const streamType = this.app.state.settings.webrtc.media.stream.type
        this.app.setState({
            settings: {webrtc: {media: {stream: {[streamType]: {selected: new Date().getTime()}}}}},
            ui: {menubar: {event: 'calling'}},
        })
        this.timerId = window.setInterval(() => {
            this.setState({timer: {current: new Date().getTime()}})
        }, 1000)
    }


    /**
     * Takes care of returning to a state before the call
     * was created. Make sure you set the final state of a call
     * before calling cleanup. The timeout is meant to postpone
     * resetting the state, so the user has a hint of what
     * happened in between. A silent call is dropped immediatly
     * however; since no UI-interaction is involved.
     * @param {Object} options - Options to pass to _stop.
     * @param {Boolean} options.force - Force showing a notification.
     * @param {String} [options.message] - Force a notification message.
     * @param {Number} options.timeout - Postpone resetting the call state for the duration of 3 busy tones.
     */
    _stop({force = false, message = '', timeout = 0} = {}) {
        this.app.logger.debug(`${this}call is stopping in ${timeout}ms`)

        if (this.silent) {
            this.plugin.deleteCall(this)
            return
        }

        if (!message) {
            message = this.state.endpoint
            if (this.state.displayName) message += `:${this.state.displayName}`
        }
        // Stop all call state sounds that may still be playing.
        this.app.sounds.ringbackTone.stop()
        this.app.sounds.ringTone.stop()
        this.app.sounds.callEnd.play()

        if (force) {
            if (this.state.status === 'callee_busy') {
                const title = this.translations.callee_busy
                this.app.plugins.ui.notification({endpoint: this.state.endpoint, force, message, stack: true, title})
            } else {
                const title = this.translations.bye
                this.app.plugins.ui.notification({endpoint: this.state.endpoint, force, message, stack: true, title})
            }
        }

        // An ongoing call is closed. Signal listeners like activity about it.
        if (this.state.status === 'bye') {
            this.app.emit('bg:calls:call_ended', {call: this.state}, true)
        }

        // Remove the streams that are associated with this call.
        for (const streamId of Object.keys(this.streams)) {
            this.app.logger.debug(`${this}removing stream ${streamId}`)
            this._cleanupStream(streamId)
        }

        // Stop the Call interval timer.
        clearInterval(this.timerId)
        this.setState({keypad: {active: false}})
        // Reset the transfer state of target calls in case the transfer mode
        // of this Call is active and the callee ends the call.
        if (this.state.transfer.active) {
            this.plugin.__setTransferState(this, false)
        }

        window.setTimeout(() => {
            this.busyTone.stop()
            this.plugin.deleteCall(this)
            // Signal browser tabs to remove the click-to-dial notification label.
            this.app.plugins.ui.notification({endpoint: this.state.endpoint})


            const streamType = this.app.state.settings.webrtc.media.stream.type
            this.app.setState({
                settings: {webrtc: {media: {stream: {[streamType]: {selected: null}}}}},
            })

        }, timeout)
    }


    /**
     * Shared accept Call logic.
     */
    accept() {
        if (!(this.state.type === 'incoming')) throw 'session must be incoming type'
    }


    /**
     * Call-specific setState that operates within the scope
     * of the Call's state.
     * @param {Object} state - The state to update.
     */
    setState(state) {
        // This merges to the call's local state; not the app's state!
        this.app.__mergeDeep(this.state, state)
        // Allows a Call to come in without disturbing the UI.
        if (this.silent) return
        this.app.emit('fg:set_state', {action: 'upsert', path: `calls.calls.${this.id}`, state})
    }


    /**
     * Kick off the Call and get access to media
     * devices when it's not silent.
     */
    async start() {
        if (!this.silent) await this._initSinks()

        if (this.state.type === 'incoming') this._incoming()
        else if (this.state.type === 'outgoing') this._outgoing()
        else throw new Error(`invalid call type ${this.state.type}`)
    }


    /**
     * Generate a representational name for this module.
     * Used for logging.
     * @returns {String} - An identifier for this module.
     */
    toString() {
        return `${this.app}[call] [${this.id}] `
    }

}


module.exports = Call
