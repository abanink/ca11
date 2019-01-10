const _ = require('./lib')

_.test('[browser] Alice has a video call with Bob', async(t1) => {
    let [alice, bob] = await Promise.all([_.init('alice'), _.init('bob')])

    await Promise.all([_.steps.session.new(alice), _.steps.session.new(bob)])

    let [aliceOptions, bobOptions] = await Promise.all([
        _.steps.wizard.complete(alice),
        _.steps.wizard.complete(bob),
    ])

    await _.screenshot(alice, 'ready-to-use')

    // Check that there are 3 fake input/output/sound devices at the start.
    const aliceDevices = aliceOptions.input.length + aliceOptions.output.length + aliceOptions.sounds.length
    const bobDevices = bobOptions.input.length + bobOptions.output.length + bobOptions.sounds.length
    t1.equal(aliceDevices + bobDevices, 18, '<alice,bob> devices are available')

    await Promise.all([_.steps.settings.enableSip(alice), _.steps.settings.enableSip(bob)])

    await _.steps.call.callActor(alice, bob)
    await _.steps.call.answerActor(bob, alice)
})
