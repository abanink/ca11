const Plugin = require('ca11/lib/plugin')


/**
* Main entrypoint for Availability.
* @memberof AppBackground.plugins
*/
class PluginAvailability extends Plugin {
    constructor(app) {
        super(app)
    }


    /**
    * Generate a representational name for this module. Used for logging.
    * @returns {String} - An identifier for this module.
    */
    toString() {
        return `${this.app}[availability] `
    }
}

module.exports = PluginAvailability
