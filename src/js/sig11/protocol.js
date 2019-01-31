/**
 * The SIG11 protocol is a networked EventEmitter.
 *
 * Direct transports are trusted as super nodes. They control
 * how the network looks, while regular nodes use the
 * network information to establish direct connections
 * to regular nodes.
 *
 * Establishing a connection between regular nodes starts
 * with negotiating an AES key over ECDHE. After the
 * connection is established to the other peer,
 * ALL of their further communication is encrypted, but
 * use the same kind of event messaging, though strictly
 * separated from super node events, which are prefixed
 * with `sig11:super`.
 */
class Protocol {
    constructor(app) {
        this.app = app
        this.msgId = 0
    }


    format(event, data) {

    }


    /**
     * Incoming message from Websocket transport.
     * The message proofs whether it was from the
     * super node network(trusted) or from a
     * regular node (untrusted).
     *
     * Emits a sig11 prefixed event on the application.
     * Passes the emitting source node and the data.
     * @param {*} msg - The raw incoming message.
     * @param {*} endpoint - Endpoint to pass the message to.
     */
    in(msg, endpoint) {
        msg = JSON.parse(msg)
        const [event, data] = msg
        if (endpoint) endpoint.emit(`sig11:${event}`, data)
        else this.app.emit(`sig11:${event}`, data)
    }


    out(event, data) {
        const msg = [event, data, this.msgId]
        this.msgId += 1
        return JSON.stringify(msg)
    }
}


module.exports = Protocol
