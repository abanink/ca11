const WebSocket = require('ws')

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

    constructor() {
        process.title = 'sig11'

        this.network = new Network()

        this.wss = new WebSocket.Server({port: 9001})
        this.wss.on('connection', (ws, req) => {
            if (req.headers.cookie) {
                let cookieMap = new Map(req.headers.cookie.replace(/\"/g, '').split(';').map((i) => i.split('=')))
                const identity = cookieMap.get('identity')
                this.network.addNode({id: identity, transport: ws})

                ws.on('message', (message) => {
                    console.log('received: %s', message)
                })

                ws.on('close', () => {
                    this.network.removeNode(identity)
                })
            }
        })

        this.wss.on('request', function(request) {
            var connection = request.accept(null, request.origin)
            // This is the most important callback for us, we'll handle
            // all messages from users here.
            connection.on('message', function(message) {
                if (message.type === 'utf8') {
                // process WebSocket message
                }
            })
        })
    }
}


let settings = require('../../../tools/settings')(__dirname, null, false)

const server = new Sig11(settings)
