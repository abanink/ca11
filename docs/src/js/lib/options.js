module.exports = (function() {
    const env = require('ca11/lib/env')({section: 'app'})

    let options = {
        env,
        plugins: {
            builtin: [
                {module: require('../plugins/page'), name: 'page'},
            ],
            custom: [],
        },
    }

    return options
})()
