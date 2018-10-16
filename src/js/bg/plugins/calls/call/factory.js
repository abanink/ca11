const SipCall = require('./sip')
const Sig11Call = require('./sig11')

module.exports = function(app) {
    /**
    * Produce a Call instance based on the application's
    * conditions like whether WebRTC calling is enabled or
    * when a ConnectAB call is required. The Factory should
    * always be used to create Calls with.
    * @param {String} target - Target for the Call constructor.
    * @param {String} options - Options to pass to the Call constructor.
    * @param {String} type - Force to create a type of Call.
    * @returns {Call} - A type of Call, currently `CallSIP` or `CallConnectAB`.
    * @memberof app.plugins.calls
    */
    function callFactory(target = null, options = {}, type = null) {
        // Return a specific type of Call when requested.
        let call = null

        if (type === 'CallSIP') {
            call = new SipCall(app, target, options)
        } else {
            call = new Sig11Call(app, target, options)
        }

        if (call) return call
        throw 'Factory couldn\'t produce a valid Call target!'
    }

    return callFactory
}
