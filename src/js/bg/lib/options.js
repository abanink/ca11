/**
* Setup options to run a bg instance of Ca11 can be a bit
* verbose, that's why this is handled from one place for both
* Node and Browsers.
*/
module.exports = (function() {
    const env = require('../../lib/env')({section: 'bg'})

    let options = {
        env,
        plugins: {
            builtin: [
                {module: require('../plugins/activity'), name: 'activity'},
                {module: require('../plugins/app'), name: 'app'},
                {
                    addons: null,
                    module: require('../plugins/availability'),
                    name: 'availability',
                },
                {module: require('../plugins/calls'), name: 'calls'},
                {
                    i18n: null,
                    module: require('../plugins/contacts'),
                    name: 'contacts',
                    providers: null,
                },
                {module: require('../plugins/settings'), name: 'settings'},
                {module: require('../plugins/ui'), name: 'ui'},
                {
                    adapter: null,
                    i18n: null,
                    module: require('../plugins/user'),
                    name: 'user',
                },
            ],
            custom: null,
        },
    }

    let contactsPlugin = options.plugins.builtin.find((i) => i.name === 'contacts')
    let userPlugin = options.plugins.builtin.find((i) => i.name === 'user')

    // Load plugins from settings.
    if (env.isNode) {
        const rc = require('rc')
        let settings = {}
        rc('ca11', settings)
        const BRAND = process.env.BRAND ? process.env.BRAND : 'ca11'
        const brand = settings.brands[BRAND]
        contactsPlugin.providers = brand.plugins.builtin.contacts.providers
        contactsPlugin.i18n = brand.plugins.builtin.contacts.i18n
        userPlugin.i18n = brand.plugins.builtin.user.i18n
        options.plugins.custom = brand.plugins.custom
    } else {
        // Load plugins through envify replacement.
        contactsPlugin.providers = process.env.BUILTIN_CONTACTS_PROVIDERS
        contactsPlugin.i18n = process.env.BUILTIN_CONTACTS_I18N
        options.plugins.custom = process.env.CUSTOM_MOD

        // Add an extra extension-specific module.
        if (env.isExtension) {
            options.plugins.builtin.push({module: require('../plugins/extension'), name: 'extension'})
        }
    }

    return options
})()
