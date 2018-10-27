const SipCall = require('./sip')
const Sig11Call = require('./sig11')

module.exports = function(app) {
    /**
    * Produce a Call instance based on the preferred protocol.
    * @param {Object} callDescription - Describes the new Call object.
    * @param {String} options - Options to pass to the Call constructor.
    * @returns {Call} - A type of Call, currently `CallSIP` or `Sig11Call`.
    * @memberof app.plugins.calls
    */
    function callFactory(callDescription, options) {
        // Return a specific type of Call when requested.
        let call = null
        if (callDescription.protocol === 'sip') {
            call = new SipCall(app, callDescription, options)
        } else if (callDescription.protocol === 'sig11') {
            call = new Sig11Call(app, callDescription, options)
        }

        if (call) return call
        throw 'Factory couldn\'t produce a Call!'
    }

    return callFactory
}
