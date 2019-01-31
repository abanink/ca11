class Endpoint extends EventEmitter {

    constructor(app, node) {
        super()

        this.app = app
        this.transport = node.transport

        // Endpoint is already identifiedis (e.g. `sig11:network`)
        if (node.id && node.key) {
            this.id = node.id
            this.headless = node.headless
            this.key = node.key
        } else {
            // Do an initial identification.
            this.once('sig11:identify', async(_node) => {
                this.headless = _node.headless
                this.key = _node.key

                this.id = await this.app.crypto.hash(this.key)
                this.app.logger.info(`${this}identified as ${this.id}`)
                this.emit('sig11:identified')
            })
        }
    }


    send(msg) {
        try {
            this.transport.send(msg)
            // eslint-disable-next-line no-empty
        } catch (err) {}
    }


    /**
     * Serialize to a node's properties.
     * @returns {Object} - JSON-serializable Node info.
     */
    serialize() {
        return {
            headless: this.headless,
            id: this.id,
            key: this.key,
        }
    }


    toString() {
        if (this.id) return `[node-${this.id.substr(0, 6)}] `
        else return '[node-?]'
    }
}

module.exports = Endpoint
