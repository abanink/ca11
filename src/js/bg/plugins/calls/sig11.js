class Sig11 {
    constructor(app) {
        this.app = app
    }


    connect() {
        const endpoint = this.app.state.calls.sig11.endpoint
        this.app.logger.info(`${this}connecting to sig11 network at ${endpoint}`)
        document.cookie = `identity=${this.app.state.user.identity.publicKey}`

        this.ws = new WebSocket(endpoint, 'sig11')

        this.ws.onopen = (event) => {
            this.app.setState({calls: {sig11: {status: 'connected'}}})
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

module.exports = Sig11
