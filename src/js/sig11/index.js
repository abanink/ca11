const WebSocket = require('ws')
const http = require('http')

const Network = require('./network')


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
class Sig11 {

    constructor(settings) {
        process.title = 'sig11'
        this.settings = settings
        this.sockets = []
        this.network = new Network()
    }


    onConnection(ws, req) {
        if (req.headers.cookie) {
            let cookieMap = new Map(req.headers.cookie.replace(/\"/g, '').split(';').map((i) => i.split('=')))
            const identity = cookieMap.get('identity')

            this.network.addNode({id: identity, transport: ws})

            ws.on('message', (message) => {
                message = JSON.parse(message)
                if (message.node) {
                    let node = this.network.findNode(message.node)

                    if (node) {
                        node.transport.send(JSON.stringify(message))
                    }
                }
            })

            ws.on('close', () => {
                this.network.removeNode(identity)
            })
        }
    }


    onRequest(request) {
        var connection = request.accept(null, request.origin)
        // This is the most important callback for us, we'll handle
        // all messages from users here.
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
}


let settings = require('../../../gulp/settings')(__dirname)
const sig11 = new Sig11(settings)
module.exports = sig11
