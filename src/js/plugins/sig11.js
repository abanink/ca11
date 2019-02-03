const Endpoint = require('ca11/sig11/endpoint')
const Protocol = require('ca11/sig11/protocol')
const Network = require('ca11/sig11/network')

/**
* SIG11 Network logic for CA11 clients.
* @module ModuleUI
*/
class PluginSIG11 extends Plugin {
    constructor(app) {
        super(app)
        app.sig11 = this

        this.protocol = new Protocol(this.app)

        this.app.on('core:session-ready', () => {
            this.network = new Network(this.app)

            const key = this.app.state.sig11.identity.publicKey
            // Identify ourselves to be the owner of this network.
            this.network.identify({key})
            this.connect()
        })

        this.app.on('sig11:node-removed', (node) => {
            this.network.removeNode(node)
        })

        this.app.on('sig11:node-added', ({node, parent}) => {
            this.network.addNode(node, parent)
        })

        // Node is identified on the network.
        this.app.on('sig11:network', ({edges, identity, nodes}) => {
            // Add the provider of this network as an endpoint,
            // because it has a transport.
            identity.transport = this.ws
            const endpoint = new Endpoint(this.app, identity)
            this.network.addEndpoint(endpoint)
            // Import the remove network layout.
            this.network.import({edges, nodes})
            this.app.setState({sig11: {status: 'registered'}})
        })
    }

    _initialState() {
        return {
            enabled: true,
            endpoint: process.env.SIG11_ENDPOINT,
            identity: {
                id: null,
                privateKey: null,
                publicKey: null,
            },
            network: {
                edges: [],
                nodes: [],
            },
            status: 'loading',
            toggled: true,
        }
    }


    _onClose(event) {
        this.app.setState({sig11: {status: 'disconnected'}})
        setTimeout(() => {
            this.connect()
        }, 500)
    }


    async _onMessage(e) {
        this.protocol.in(e.data)
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
        this.app.setState({sig11: {status: 'connected'}})
        this.ws.send(this.protocol.out('identify', {
            headless: this.app.env.isNode,
            key: this.app.state.sig11.identity.publicKey,
        }))

        this.ws.onmessage = this._onMessage.bind(this)
    }


    connect() {
        const endpoint = this.app.state.sig11.endpoint
        this.app.logger.info(`${this}connecting to sig11 network at ${endpoint}`)

        if (!endpoint.includes('ws://') && !endpoint.includes('wss://')) {
            this.ws = new WebSocket(`wss://${endpoint}`, 'sig11')
        } else {
            this.ws = new WebSocket(endpoint, 'sig11')
        }

        this.ws.onopen = this._onOpen.bind(this)
        this.ws.onclose = this._onClose.bind(this)
    }
}


module.exports = PluginSIG11
