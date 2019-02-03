// Custom SIP.js description handler.



class SipCalls {

    constructor(callsPlugin) {
        this.app = callsPlugin.app

        // Handle incoming calls.
        this.app.on('sip:ua', () => {
            this.app.sip.ua.on('invite', this.onInvite.bind(this))
        })


        this.app.on('sip:dtmf', ({callId, key}) => {
            this.app.plugins.caller.calls[callId].session.dtmf(key)
        })
    }


    /**
     * Event handler for an incoming SIP call, known as an 'invite'.
     * @param {Session} session - The SIP.js session.
     */
    onInvite(session) {
        this.app.logger.debug(`${this}<event:invite>`)
        const callIds = Object.keys(this.app.plugins.caller.calls)
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
        } else if (callOngoing) {
            // All ongoing calls are closing. Accept the call.
            if (callIds.length === closingCalls.length) {
                acceptCall = true
            } else {
                // Filter non-closing calls from all Call objects.
                const notClosingCalls = callIds.filter((i) => !closingCalls.includes(i))
                // From these Call objects, see which ones are not `new`.
                const notClosingNotNewCalls = notClosingCalls.filter((i) => this.app.plugins.caller.calls[i].state.status !== 'new')

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
                this.deleteCall(this.app.plugins.caller.calls[callId])
            }
        }
        // A declined Call will still be initialized, but as a silent
        // Call, meaning it won't notify the user about it.
        const call = this.app.plugins.caller.callFactory({
            protocol: 'sip',
            session,
        }, {silent: !acceptCall})

        call.start()

        if (!acceptCall) {
            this.app.logger.info(`${this}incoming call ${session.request.call_id} denied by invite handler: (${declineReason})`)
            call.terminate()
        } else {
            this.app.logger.info(`${this}incoming call ${session.request.call_id} allowed by invite handler`)
            Vue.set(this.app.state.caller.calls, call.id, call.state)
        }
        // Save call reference.
        this.app.plugins.caller.calls[call.id] = call
    }


    /**
     * Generate a representational name for this module. Used for logging.
     * @returns {String} - An identifier for this module.
     */
    toString() {
        return `${this.app}[caller][sip] `
    }

}

module.exports = SipCalls
