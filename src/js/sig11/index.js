const WebCrypto = require('node-webcrypto-ossl')

const WebSocket = require('ws')
const http = require('http')

global.EventEmitter = require('eventemitter3')
global.btoa = require('btoa')

const Crypto = require('../lib/crypto')
const Endpoint = require('./endpoint')
const Network = require('./network')
const Skeleton = require('../lib/skeleton')


/**
* Sig11 is a signalling layer used to setup p2p calls with.
* The first iteration focusses on getting feature parity
* with SIP calling by keeping complexity low. The second
* iteration will focus on moving the signalling layer to
* Ca11 client, making signalling p2p with configurable
* bootstrap nodes. Therefor the signalling protocol
* in the first iteration will include a routing
* strategy.
*/
class Sig11 extends Skeleton {

    constructor(settings) {
        const env = require('../lib/env')({})
        super({env})
        process.title = 'sig11'
        global.crypto = new WebCrypto({})

        this.crypto = new Crypto(this)

        this.settings = settings
        this.sockets = []

        this.initNetwork()
    }


    async initNetwork() {
        this.network = new Network(this)
        this.keypair = await this.network.crypto.createIdentity()
        this.network.setIdentity(this.keypair)
    }


    async onConnection(ws, req) {
        const endpoint = new Endpoint(this.network, {}, ws)

        // Transport data handler.
        ws.on('message', async(msg) => {
            try {
                msg = JSON.parse(msg)
            } catch (err) {
                return
            }
            if (msg.length === 3) {
                await this.network.protocol.in(msg, endpoint)
            } else if (msg.length === 4) {
                this.network.protocol.inRelay(msg, endpoint)
            }
        })

        endpoint.once('sig11:identified', () => {
            this.network.addEndpoint(endpoint, this.network.identity)
            endpoint.send(this.network.protocol.out('network', this.network.export()))

            const msg = this.network.protocol.out('node-added', {
                node: endpoint.serialize(),
                parent: this.network.identity,
            })
            // Notify others about the new node.
            this.network.broadcast(msg, {excludes: [endpoint]})
        })

        ws.on('close', () => {
            this.network.removeEndpoint(endpoint)
            const msg = this.network.protocol.out('node-removed', endpoint.serialize())
            this.network.broadcast(msg)
        })
    }


    onRequest(request) {
        var connection = request.accept(null, request.origin)

        connection.on('message', function(message) {
            if (message.type === 'utf8') {
            // process WebSocket message
            }
        })
    }


    async start() {
        this.server = http.createServer()
        // Keep track of the connections, so we can
        // shutdown properly in .stop by destroying
        // all sockets.
        this.server.on('connection', (socket) => this.sockets.push(socket))

        this.wss = new WebSocket.Server({
            disableHixie: true,
            perMessageDeflate: false,
            protocolVersion: 17,
            server: this.server,
        })

        this.wss.on('connection', this.onConnection.bind(this))
        this.wss.on('request', this.onRequest.bind(this))

        return new Promise((resolve) => {
            this.server.listen(this.settings.sig11.port, () => {
                resolve()
            })
        })
    }

    async stop() {
        for (const socket of this.sockets) {
            socket.destroy()
        }

        this.sockets = []
        return new Promise((resolve) => {
            this.server.close(() => {
                resolve()
            })
        })
    }


    /**
    * Generate a representational name for this module. Used for logging.
    * @returns {String} - An identifier for this module.
    */
    toString() {
        return '[sig11]'
    }
}


let settings = require('../../../gulp/settings')(__dirname)
const sig11 = new Sig11(settings)

module.exports = sig11
