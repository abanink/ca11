module.exports = (function() {
    const env = require('../../lib/env')({section: 'fg'})

    let options = {
        env,
        plugins: {
            builtin: [
                {
                    addons: null,
                    module: require('../plugins/availability'),
                    name: 'availability',
                },
            ],
            custom: null,
        },
    }

    if (env.isNode) {
        const rc = require('rc')
        let settings = {}
        rc('ca11', settings)
    } else {
        // Load modules through envify replacement.
        options.plugins.custom = process.env.CUSTOM_MOD
    }

    return options
})()
