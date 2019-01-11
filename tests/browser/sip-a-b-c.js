const _ = require('./lib')

_.test('[SIP] Alice calls Bob, Bob transfers Alice to Charlie', async(t1) => {
    let [alice, bob, charlie] = await Promise.all(
        [_.init('alice'), _.init('bob'), _.init('charlie')]
    )

    // Alice first; so she can make screenshots.
    await _.steps.meta.setupSip(alice)

    await Promise.all([
        _.steps.meta.setupSip(bob),
        _.steps.meta.setupSip(charlie),
    ])

    // Alice calls Bob.
    await _.steps.call.callActor(alice, bob)
    await _.steps.call.answerActor(bob, alice)

    // Bob transfers Alice to Charlie.
    await _.steps.call.transferActor(alice, bob, charlie)
})
