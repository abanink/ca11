const Sig11Call = require('./call/sig11')


/**
 * Deals with SIG11 call logic that is not strictly
 * bound to a single Call.
 * @module Sig11Caller
 */
class Sig11Caller {

    constructor(app, plugin) {
        this.app = app
        this.plugin = plugin

        /**
         * Remote node signalled that the call is accepted.
         */
        this.app.on('sig11:call-answer', ({answer, callId, nodeId}) => {
            plugin.calls[callId].setupAnswer(answer)
        })


        // Candidates from initiating caller, sent after it got the
        // confirmation that the call was accepted.
        this.app.on('sig11:call-candidate', ({callId, candidate, nodeId}) => {
            // Only accept candidates for a valid call.
            if (!plugin.calls[callId]) return
            if (plugin.calls[callId].state.status === 'bye') return

            const pc = plugin.calls[callId].pc
            // The RTCPeerConnection is not available in the early
            // state of a call. Candidates are temporarily stored to
            // be processed when the RTCPeerConnection is made.
            if (pc && candidate) pc.addIceCandidate(new RTCIceCandidate(candidate))
            else {
                plugin.calls[callId].candidates.push(candidate)
            }
        })


        /**
         * An incoming call, a 'Call offer', is coming in from
         * a remote node. A new incoming call will show up.
         */
        this.app.on('sig11:call-offer', ({callId, nodeId, offer}) => {
            const node = this.app.sig11.network.node(nodeId)
            const description = {id: callId, node, offer, type: 'incoming'}
            // For now, don't support call waiting and abandon the incoming
            // call when there is already a call going on.
            if (Object.keys(plugin.calls).length) {
                this.app.sig11.emit(nodeId, 'call-terminate', {callId, status: 'callee_busy'})
                return
            }

            const call = new Sig11Call(this.app, description)
            this.app.logger.info(`${this}incoming call ${callId}:${nodeId}`)

            Vue.set(this.app.state.caller.calls, call.id, call.state)
            plugin.calls[call.id] = call

            call.start()
        })


        this.app.on('sig11:call-terminate', ({callId, status}) => {
            plugin.calls[callId].terminate({remote: false, status})
        })
    }


    /**
    * Generate a representational name for this module. Used for logging.
    * @returns {String} - An identifier for this module.
    */
    toString() {
        return `${this.app}[caller][sig11] `
    }
}

module.exports = Sig11Caller
