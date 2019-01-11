
const _ = require('../test')

const {AppBackground, options} = require('../../src/js/bg')

_.test('[bg] starting up sequence', function(t) {
    t.plan(2)

    const bg = new AppBackground(options)
    bg.on('factory-defaults', () => {
        // The schema is set after a factory reset.
        t.equal(
            bg.store.get('schema'),
            bg.store.schema, `storage: schema version (${bg.store.schema}) present after factory reset`,
        )
    })
    // There is no schema in the database on a fresh start.
    t.equal(bg.store.get('schema'), null, 'storage: schema absent on startup')
})


