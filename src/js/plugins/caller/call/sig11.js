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

        this.candidates = []
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

        this.rtcEvents()

        const stream = this.app.state.settings.webrtc.media.stream
        const localStream = this.app.media.streams[stream[stream.type].id]

        for (const track of localStream.getTracks()) {
            this.pc.addTrack(track, localStream)
        }

        const offer = await this.pc.createOffer()
        // Triggers ICE negotiation.
        this.pc.setLocalDescription(offer)

        // Send the offer to the target node Id.
        await this.app.sig11.emit(this.state.endpoint, 'call-offer', {
            callId: this.id,
            offer: this.pc.localDescription.sdp,
        })
    }


    /**
    * An incoming call is accepted by the user. Let's
    * start with establishing a WebRTC session. ICE
    * candidates can be already available from
    * `sig11:call-candidate`, because ICE gathering
    * is an async process that starts when `setLocalDescription`
    * is executed on the initiating side.
    */
    async accept() {
        super.accept()

        this.pc = new RTCPeerConnection({
            iceServers: this.app.state.settings.webrtc.stun.map((i) => ({urls: i})),
        })

        this.rtcEvents()

        const stream = this.app.state.settings.webrtc.media.stream
        const localStream = this.app.media.streams[stream[stream.type].id]

        for (const track of localStream.getTracks()) {
            this.pc.addTrack(track, localStream)
        }

        await this.pc.setRemoteDescription({sdp: this.offer, type: 'offer'})
        const answer = await this.pc.createAnswer()

        this.candidates.forEach((c) => {
            if (c) this.pc.addIceCandidate(new RTCIceCandidate(c))
        })

        delete this.candidates
        // Triggers ICE negotiation.
        await this.pc.setLocalDescription(answer)
        await this.app.sig11.emit(this.node.id, 'call-answer', {
            answer: answer.sdp,
            callId: this.id,
        })

        this._start({message: this.translations.accepted.outgoing})
    }


    rtcEvents() {
        // send any ice candidates to the other peer
        this.pc.onicecandidate = ({candidate}) => {
            // Send candidates as soon the outgoing call is confirmed
            // with the remote node sending a `c ll-answer`.
            this.app.sig11.emit(this.node.id, 'call-candidate', {
                callId: this.id,
                candidate,
            })
        }

        // once remote track media arrives, show it in remote video element
        this.pc.ontrack = (e) => {
            const stream = e.streams[0]
            if (!this.app.media.streams[stream.id]) this.addStream(stream, 'video')

            const path = `caller.calls.${this.id}.streams.${stream.id}`
            e.track.onunmute = () => {this.app.setState({muted: false}, {path})}
            e.track.onmute = () => {this.app.setState({muted: true}, {path})}
            e.track.onended = () => {this._cleanupStream(stream.id)}
        }
    }


    /**
    * Other side accepted the call. Process sdp with the
    * RTCPeerConnection that was made in `_outgoing`.
    * @param {String} answer - The raw SDP message.
    */
    async setupAnswer(answer) {
        await this.pc.setRemoteDescription({sdp: answer, type: 'answer'})
        this._start()
    }


    /**
    * Terminate this Call.
    * @param {Boolean} remote - Inform remote node about termination.
    */
    async terminate({remote = true, status = 'bye'} = {}) {
        this.setState({status})
        // Close connected streams when the call is already
        // flowing. Skip when the call is terminated before
        // the peer is connected.
        if (this.pc) {
            try {
                this.pc.close()
            } catch (err) {
                // Just try to close it anyway; don't bother for errors.
            }
        }

        this._stop()
        if (remote) {
            await this.app.sig11.emit(this.node.id, 'call-terminate', {
                callId: this.id,
                status,
            })
        }
    }


    /**
    * Generate a representational name for this module. Used for logging.
    * @returns {String} - An identifier for this module.
    */
    toString() {
        return `${this.app}[CallSIG11][${this.id}] `
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
