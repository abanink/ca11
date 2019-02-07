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
    * @param {CA11} app - The background application.
    * @param {Node} description - Call description for SIG11.
    * @param {Object} [options] - An endpoint identifier to call to.
    * @param {Boolean} [options.active] - Activates this Call in the UI.
    * @param {Boolean} [options.silent] - Setup a Call without interfering with the UI.
    */
    constructor(app, description) {
        super(app, description)

        this.node = description.node
        this.state.protocol = 'sig11'

        const state = {
            endpoint: description.node.id,
            keypad: {mode: 'call'},
        }

        state.type = description.type

        if (state.type === 'outgoing') {
            state.status = 'new'
        } else {
            // An incoming call starts with the sdp offer.
            this.offer = description.offer
            state.status = 'invite'
        }

        app._mergeDeep(this.state, state)
    }


    _events() {
        // send any ice candidates to the other peer
        this.pc.onicecandidate = ({candidate}) => {
            // this.plugin.ws.send({candidate})
        }

        // let the "negotiationneeded" event trigger offer generation
        // this.pc.onnegotiationneeded = async () => {
        //     console.log("NEGOTIATION SEND")

        // }

        // once remote track media arrives, show it in remote video element
        this.pc.ontrack = (event) => {
            // don't set srcObject again if it is already set.
            // if (remoteView.srcObject) return
            // remoteView.srcObject = event.streams[0]
        }
    }


    /**
    * Handle an incoming `invite` call from.
    */
    _incoming() {
        super._incoming()
    }


    /**
    * Setup an outgoing call to a destination node.
    * @param {(Number|String)} number - The number to call.
    */
    async _outgoing() {
        super._outgoing()

        this.pc = new RTCPeerConnection({
            iceServers: this.app.state.settings.webrtc.stun.map((i) => ({urls: i})),
        })

        this._events()

        const stream = this.app.state.settings.webrtc.media.stream
        const localStream = this.app.media.streams[stream[stream.type].id]
        this.pc.addStream(localStream)

        const offer = await this.pc.createOffer()
        this.pc.setLocalDescription(offer)

        // Send the offer to the target node Id.
        await this.app.sig11.emit(this.state.endpoint, 'call-offer', {
            callId: this.id,
            offer: this.pc.localDescription.sdp,
        })
    }


    /**
    * An incoming call is accepted by the user. Let's
    * start with establishing a WebRTC session.
    */
    async accept() {
        super.accept()

        this.pc = new RTCPeerConnection({
            iceServers: this.app.state.settings.webrtc.stun.map((i) => ({urls: i})),
        })

        await this.pc.setRemoteDescription({sdp: this.offer, type: 'offer'})
        const answer = await this.pc.createAnswer()

        await this.app.sig11.emit(this.node.id, 'call-answer', {
            answer: answer.sdp,
            callId: this.id,
        })
    }


    setupAnswer() {

    }


    /**
    * Terminate a Call depending on it's current status.
    */
    terminate() {
        if (this.state.status === 'new') {
            // An empty/new call; just delete the Call object without noise.
            this.app.plugins.caller.deleteCall(this)
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
