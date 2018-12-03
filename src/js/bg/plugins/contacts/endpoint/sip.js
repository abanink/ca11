/**
* @module ModuleContacts
*/
const Endpoint = require('./index')


/**
* A SIP endpoint which can subscribe to a SIP-server
* for presence information. See PresenceSIP for
* implementation details.
*/
class EndpointSip extends Endpoint {
    /**
    * @param {Contact} contact - The contact that this endpoint is bound to.
    * @param {Object} state - The state to initialize the endpoint with.
    */
    constructor(contact, state) {
        super(contact, state)
        this.subscription = null
    }


    /**
    * Parse an incoming dialog XML request body and return
    * the account state from it.
    * @param {Request} notification - A SIP.js Request object.
    * @returns {String} - The state of the account.
    */
    _statusFromDialog(notification) {
        let parser = new DOMParser()
        let xmlDoc = parser ? parser.parseFromString(notification.request.body, 'text/xml') : null
        let dialogNode = xmlDoc ? xmlDoc.getElementsByTagName('dialog-info')[0] : null
        // Skip; an invalid dialog.
        if (!dialogNode) return null

        let stateAttr = dialogNode.getAttribute('state')
        // let localNode = dialogNode.getElementsByTagName('local')[0]
        let stateNode = dialogNode.getElementsByTagName('state')[0]
        let state = 'unavailable'

        if (stateAttr === 'full') {
            state = 'available'
        }

        // State node has final say, regardless of stateAttr!
        if (stateNode) {
            switch (stateNode.textContent) {
                case 'trying':
                case 'proceeding':
                case 'early':
                    state = 'ringing'
                    break
                case 'confirmed':
                    state = 'busy'
                    break
                case 'terminated':
                    state = 'available'
                    break
            }
        }
        return state
    }


    /**
    * Subscribe to the SIP server.
    * @returns {Promise} - Resolves when ready.
    */
    subscribe() {
        return new Promise((resolve, reject) => {
            this.app.logger.info(`${this} subscribe ${this.endpoint.state.id}@ca11.io`)
            this.subscription = this.app.plugins.calls.ua.subscribe(`${this.endpoint.state.id}@ca11.io`, 'dialog')
            this.subscription.on('notify', (notification) => {
                const status = this._statusFromDialog(notification)
                if (status) this.endpoint.setState({status})
                resolve(this.endpoint)
            })
        })
    }


    /**
    * Stop listening for subscriber events from the SIP server and remove
    * the cached subscriber state.
    * @param {Number} accountId - The accountId to deregister.
    */
    unsubscribe() {
        if (this.subscription) {
            try {
                this.subscription.unsubscribe()
                this.endpoint.setState({status: 'unregistered'})
            } catch (err) {
                this.app.logger.debug(`${this}failed to unsubscribe properly`)
            }


        }
        this.subscription = null
    }
}

module.exports = EndpointSip
