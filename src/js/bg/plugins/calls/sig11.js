class Sig11Calls {

    constructor(callsPlugin) {
        this.app = callsPlugin.app
        this.plugin = callsPlugin
    }


    _onClose(event) {
        this.app.setState({calls: {sig11: {status: 'disconnected'}}})
        setTimeout(() => {
            this.connect()
        }, 500)
    }


    async _onMessage(message) {
        let data = JSON.parse(message.data)
        if (data.sdp && data.sdp.type === 'offer') {
            //incoming call.
            const call = this.plugin.callFactory({}, {silent: false}, 'CallSIG11')
            this.plugin.calls[call.id] = call
            call.start()

            this.pc = new RTCPeerConnection({
                iceServers: [{
                    urls: 'stun:stun3.l.google.com:19302',
                }],
            })

            await this.pc.setRemoteDescription(data.sdp)
            const answer = await this.pc.createAnswer()
        }
    }


    _onOpen(event) {
        this.app.setState({calls: {sig11: {status: 'registered'}}})
        this.ws.onmessage = this._onMessage.bind(this)
    }


    connect() {
        const endpoint = this.app.state.calls.sig11.endpoint
        this.app.logger.info(`${this}connecting to sig11 network at ${endpoint}`)
        document.cookie = `identity=${this.app.state.user.identity.publicKey}`

        this.ws = new WebSocket(endpoint, 'sig11')
        this.ws.onopen = this._onOpen.bind(this)
        this.ws.onclose = this._onClose.bind(this)
    }


    /**
    * Generate a representational name for this module. Used for logging.
    * @returns {String} - An identifier for this module.
    */
    toString() {
        return `${this.app}[calls][sig11] `
    }
}

module.exports = Sig11Calls
