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
         * An outgoing call was made by this peer; the other node
         * accepted the call and sent back the 'Call answer'.
         */
        this.app.on('sig11:call-answer', async({answer, callId, nodeId}) => {
            plugin.calls[callId].setupAnswer(answer)
        })


        /**
         * An incoming call, a 'Call offer', is coming in from
         * a remote node. A new incoming call will show up.
         */
        this.app.on('sig11:call-offer', async({callId, nodeId, offer}) => {
            const node = this.app.sig11.network.node(nodeId)
            const description = {id: callId, node, offer, type: 'incoming'}
            const call = new Sig11Call(this.app, description)


            this.app.logger.info(`${this}incoming call from ${nodeId}`)

            Vue.set(this.app.state.caller.calls, call.id, call.state)
            plugin.calls[call.id] = call
            // Show UI and start ringing.
            call.start()

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
