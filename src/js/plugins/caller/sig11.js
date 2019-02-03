class Sig11Calls {

    constructor(callsPlugin) {
        this.app = callsPlugin.app
    }


    /**
    * Generate a representational name for this module. Used for logging.
    * @returns {String} - An identifier for this module.
    */
    toString() {
        return `${this.app}[caller][sig11] `
    }
}

module.exports = Sig11Calls
