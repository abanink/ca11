class Sig11Calls {

    constructor(callsPlugin) {
        this.app = callsPlugin.app
        this.plugin = callsPlugin
    }


    connect() {
        const endpoint = this.app.state.calls.sig11.endpoint
        this.app.logger.info(`${this}connecting to sig11 network at ${endpoint}`)
        document.cookie = `identity=${this.app.state.user.identity.publicKey}`

        this.ws = new WebSocket(endpoint, 'sig11')

        this.ws.onopen = (event) => {
            this.app.setState({calls: {sig11: {status: 'registered'}}})

            this.ws.onmessage = async(message) => {
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
        }

        this.ws.onclose = (event) => {
            this.app.setState({calls: {sig11: {status: 'disconnected'}}})
            setTimeout(() => {
                this.connect()
            }, 500)
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

module.exports = Sig11Calls
