const Plugin = require('ca11/lib/plugin')


/**
* Main entrypoint for Availability.
* @memberof AppBackground.plugins
*/
class PluginAvailability extends Plugin {
    /**
    * @param {AppBackground} app - The background application.
    * @param {Array} addons - List of AvailabilityAddon classes.
    */
    constructor(app) {
        super(app)
    }


    /**
    * Initializes the module's store.
    * Notice that the `sud` property is used to keep track of the
    * selecteduserdestination API endpoint reference.
    * @returns {Object} The module's store properties.
    */
    _initialState() {
        let adapterState = {}

        return Object.assign({
            available: true,
            dnd: false,
        }, adapterState)
    }


    /**
    * Setup availability-specific store watchers.
    * @param {Boolean} dndEnabled - Whether do-not-disturb is being enabled.
    * @returns {Object} - Properties that need to be watched.
    */
    _watchers() {
        let addonWatchers = {}

        return Object.assign({
            'store.availability.dnd': (dndEnabled) => {
                this.app.plugins.ui.menubarState()
            },
        }, addonWatchers)
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
