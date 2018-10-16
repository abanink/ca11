/**
* @module ModuleCalls
*/
const Call = require('./index')

/**
* Call implementation for incoming and outgoing calls
* using WebRTC and SIP.js.
*/
class CallSIG11 extends Call {
    /**
    * @param {AppBackground} app - The background application.
    * @param {String|Number|Session} [target] - An endpoint identifier to call to.
    * @param {Object} [options] - An endpoint identifier to call to.
    * @param {Boolean} [options.active] - Activates this Call in the UI.
    * @param {Boolean} [options.silent] - Setup a Call without interfering with the UI.
    */
    constructor(app, target, {active, silent} = {}) {
        super(app, target, {active, silent})

        if (!target || ['string', 'number'].includes(typeof target)) {
            app.__mergeDeep(this.state, {keypad: {mode: 'call'}, number: target, status: 'new', type: 'outgoing'})
        } else {
            // Passing in a session as target means an incoming call.
            app.__mergeDeep(this.state, {keypad: {mode: 'dtmf'}, status: 'invite', type: 'incoming'})
            this.session = target
        }
    }


    _events() {
        // send any ice candidates to the other peer
        // this.pc.onicecandidate = ({candidate}) => {
        //     console.log("ONICECANDIDATE", candidate)
        //     this.plugin.ws.send({candidate})
        // }

        // // let the "negotiationneeded" event trigger offer generation
        // this.pc.onnegotiationneeded = async () => {
        //     console.log("NEGOTATION NEEDED")
        //     try {
        //         await this.pc.setLocalDescription(await this.pc.createOffer())
        //         // send the offer to the other peer
        //         this.plugin.ws.send({desc: this.pc.localDescription})
        //     } catch (err) {
        //         console.error(err)
        //     }
        // }

        // // once remote track media arrives, show it in remote video element
        // this.pc.ontrack = (event) => {
        //     console.log("ONTRACK", event)
        //     // don't set srcObject again if it is already set.
        //     // if (remoteView.srcObject) return
        //     // remoteView.srcObject = event.streams[0]
        // }
    }


    /**
    * Handle an incoming `invite` call from.
    */
    _incoming() {
        super._incoming()
    }


    /**
    * Setup an outgoing call.
    * @param {(Number|String)} number - The number to call.
    */
    async _outgoing() {
        super._outgoing()

        this.pc = new RTCPeerConnection({
            iceServers: [{
                urls: 'stun:stun3.l.google.com:19302',
            }],
        })

        this.pc.addStream(this.app.localStream)

        this._events()

        const offer = await this.pc.createOffer()
        this.pc.setLocalDescription(offer)

        this.plugin.sig11Calls.ws.send(JSON.stringify({
            node: this.state.number,
            sdp: this.pc.localDescription,
        }))
    }


    /**
    * Accept an incoming session.
    */
    accept() {
        super.accept()
    }


    hold() {

    }


    async start() {
        if (this.silent) {
            if (this.state.status === 'invite') this._incoming()
            else this._outgoing()
        } else {
            // Query media and assign the stream. The actual permission must be
            // already granted from a foreground script running in a tab.
            try {
                await this._initSinks()
                if (this.state.status === 'invite') this._incoming()
                else this._outgoing()
            } catch (err) {
                console.error(err)
            }
        }
    }


    /**
    * Terminate a Call depending on it's current status.
    */
    terminate() {
        if (this.state.status === 'new') {
            // An empty/new call; just delete the Call object without noise.
            this.plugin.deleteCall(this)
            return
        } else if (this.state.status === 'create') {
            // A fresh outgoing Call; not yet started. There may or may not
            // be a session object. End the session if there is one.
            if (this.session) this.session.terminate()
            this.setState({status: 'request_terminated'})
            // The session's closing events will not be called, so manually
            // trigger the Call to stop here.
            this._stop()
        } else {

            // Calls with other statuses need some more work to end.
            try {
                if (this.state.status === 'invite') {
                    this.setState({status: 'request_terminated'})
                    this.session.reject() // Decline an incoming call.
                } else if (['accepted'].includes(this.state.status)) {
                    // Hangup a running call.
                    this.session.bye()
                    // Set the status here manually, because the bye event on the
                    // session is not triggered.
                    this.setState({status: 'bye'})
                }
            } catch (err) {
                this.app.logger.warn(`${this}unable to close the session properly. (${err})`)
                // Get rid of the Call anyway.
                this._stop()
            }
        }
    }


    /**
    * Generate a representational name for this module. Used for logging.
    * @returns {String} - An identifier for this module.
    */
    toString() {
        return `${this.app}[CallSIP][${this.id}] `
    }


    transfer(targetCall) {
        if (typeof targetCall === 'string') {
            this.session.refer(`sip:${targetCall}@ca11.io`)
        } else {
            this.session.refer(targetCall.session)
        }
    }


    unhold() {
        if (this.session) {
            this.session.unhold({
                sessionDescriptionHandlerOptions: {
                    constraints: this.app.media._getUserMediaFlags(),
                },
            })
            this.setState({hold: {active: false}})
        }
    }
}

module.exports = CallSIG11
