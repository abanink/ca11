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


    async _onMessage(e) {
        const data = JSON.parse(e.data)
        // console.log('NETWORK:', network)
        // Translate to d3 graph representation.
        const nodes = data.network.nodes.map((i) => {
            let node = Object.assign({id: i.v, x: null, y: null}, i.value)
            if (i.v === this.app.state.user.identity.publicKey) {
                // Object.assign(node, {fx: 200, fy: 100})
            }
            // console.log(node)
            return node
        })

        const edges = data.network.edges.map((i) => {
            return {
                source: {index: data.network.nodes.findIndex((j) => j.v === i.v)},
                target: {index: data.network.nodes.findIndex((j) => j.v === i.w)},
            }
        })

        this.app.setState({calls: {sig11: {network: {edges, nodes}}}})
    //     let data = JSON.parse(message.data)
    //     if (data.sdp && data.sdp.type === 'offer') {
    //         //incoming call.
    //         const call = this.plugin.callFactory({}, {silent: false}, 'CallSIG11')
    //         this.plugin.calls[call.id] = call
    //         call.start()

    //         this.pc = new RTCPeerConnection({
    //             iceServers: this.app.state.settings.webrtc.stun.map((i) => ({urls: i})),
    //         })

    //         await this.pc.setRemoteDescription(data.sdp)
    //         await this.pc.createAnswer()
    //     }
    }


    _onOpen(event) {
        this.app.setState({calls: {sig11: {status: 'registered'}}})
        this.ws.onmessage = this._onMessage.bind(this)
    }


    connect() {
        const endpoint = this.app.state.calls.sig11.endpoint
        this.app.logger.info(`${this}connecting to sig11 network at ${endpoint}`)
        document.cookie = `identity=${this.app.state.user.identity.publicKey}`

        if (!endpoint.includes('ws://') && !endpoint.includes('wss://')) {
            this.ws = new WebSocket(`wss://${endpoint}`, 'sig11')
        } else {
            this.ws = new WebSocket(endpoint, 'sig11')
        }

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
