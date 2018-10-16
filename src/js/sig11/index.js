const WebSocket = require('ws')
const connect = require('connect')
const fs = require('fs')
const https = require('https')
const path = require('path')
const pem = require('pem')
const serveStatic = require('serve-static')

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
        this.settings = require('../../../tools/settings')(__dirname)

        this.network = new Network()
        this.startService()
    }


    /**
    * Checks if a public/private keypair exists. Returns a Promise
    * with a boolean resolve indicating whether the key exists
    * or not.
    * @return {Promise}
    */
    keyPairExists(publicKeyPath, privateKeyPath) {
        return new Promise((resolve) => {
            fs.stat(publicKeyPath, err => {
                if (!err) {
                    fs.stat(privateKeyPath, _err => {
                        if (!_err) {
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    })
                } else {
                    resolve(false)
                }
            })
        })
    }


    onConnection(ws, req) {
        if (req.headers.cookie) {
            let cookieMap = new Map(req.headers.cookie.replace(/\"/g, '').split(';').map((i) => i.split('=')))
            const identity = cookieMap.get('identity')
            console.log(identity)

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


    onRequest(message) {
        var connection = request.accept(null, request.origin)
        // This is the most important callback for us, we'll handle
        // all messages from users here.
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
            // process WebSocket message
            }
        })
    }

    /**
    * Reuse an existing public/private keypair to setup a HTTP server with,
    * or create a new keypair before starting the HTTPS server during development.
    * HTTPS is a requirement to use the WebCrypto API, as well as some other
    * API's, that's why the development server is using HTTPS as well.
    * @param {String} publicKeyPath - Path to a PEM public key file.
    * @param {String} privateKeyPath - Path to a PEM private key file.
    */
    setupKeyPair(publicKeyPath, privateKeyPath) {
        return new Promise(resolve => {
            this.keyPairExists(publicKeyPath, privateKeyPath)
            .then(keyExists => {
                if (keyExists) {
                    fs.readFile(publicKeyPath, 'ascii', (err, publicKey) => {
                        fs.readFile(privateKeyPath, 'ascii', (_err, privateKey) => {
                            resolve({
                                public: publicKey,
                                private: privateKey,
                            })
                        })
                    })
                } else {
                    pem.createCertificate({days: 1, selfSigned: true}, (err, keys) => {
                        fs.writeFile(publicKeyPath, keys.certificate, 'ascii', () => {
                            fs.writeFile(privateKeyPath, keys.serviceKey, 'ascii', () => {
                                resolve({public: keys.certificate, private: keys.serviceKey})
                            })
                        })
                    })
                }
            })
        })
    }


    async startService() {
        const app = connect()

        app.use(serveStatic(this.settings.BUILD_DIR))
        app.use((req, res, next) => {
            return fs.createReadStream(path.join(this.settings.BUILD_DIR, 'index.html')).pipe(res)
        })

        let publicKeyPath = path.join(this.settings.ROOT_DIR, 'public.pem')
        let privateKeyPath = path.join(this.settings.ROOT_DIR, 'private.pem')
        let keypair = await this.setupKeyPair(publicKeyPath, privateKeyPath)

        this.server = https.createServer({cert: keypair.public, key: keypair.private}, app).listen(8999)
        this.wss = new WebSocket.Server({
            disableHixie: true,
            perMessageDeflate: false,
            protocolVersion: 17,
            server: this.server,
        })

        this.wss.on('connection', this.onConnection.bind(this))
        this.wss.on('request', this.onRequest.bind(this))
    }
}


let settings = require('../../../tools/settings')(__dirname, null, false)

const server = new Sig11(settings)
