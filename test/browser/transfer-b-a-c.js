const _ = require('./lib')

_.test('[browser] Alice calls Bob and transfers blind to Charlie.', async(t, onExit) => {

    let [alice, bob, charlie] = await Promise.all(
        [_.init('alice'), _.init('bob'), _.init('charlie')]
    )

    await Promise.all([
        _.steps.meta.prepareSip(alice),
        _.steps.meta.prepareSip(bob),
        _.steps.meta.prepareSip(charlie),
    ])

    // Alice calls Bob.
    await _.steps.call.callActor(alice, bob)
    await _.steps.call.answerActor(bob, alice)

    // Bob transfers Alice to Charlie.
    await _.steps.call.transferActor(alice, bob, charlie)

    // // Call bob.
    // await step('alice', 'calling bob')

    // await _.steps.call.callActor(alice, bob)
    // await _.steps.call.answerActor(bob, alice)

    // // await utils.keypadEntry(alice, brand.tests.bob.number)
    // // await alice.page.click('.test-call-button')
    // // await alice.page.waitFor('.component-calls .call-ongoing')
    // await screenshot(alice, 'calldialog-outgoing')

    // // Answer alice.
    // await bob.page.waitFor('.component-calls .call-ongoing')
    // await step('bob', 'answer call', 'alice calls')
    // await screenshot(bob, 'calldialog-incoming')
    // await bob.page.click('.component-call .test-button-accept')

    // // Alice and bob are now getting connected;
    // // wait for alice and bob to see the connected screen.
    // await alice.page.waitFor('.component-call .call-options')
    // // Verify alice is talking to bob.
    // const aliceNumber = await utils.getText(alice, '.component-call .info-number')
    // t.equal(brand.tests.bob.number, aliceNumber, 'alice sees bob\'s number')

    // await bob.page.waitFor('.component-call .call-options')
    // Verify bob is talking to alice.
    // const bobNumber = await utils.getText(bob, '.component-call .info-number')
    // t.equal(brand.tests.alice.number, bobNumber, 'bob sees alice\'s number')



    // Charlie is being called and answers.
    // await charlie.page.waitFor('.component-calls .call-ongoing')
    // step('charlie', 'answer call', 'alice calls')
    // await screenshot(charlie, 'calldialog-incoming')
    // await charlie.page.click('.component-call .test-button-accept')
    // await charlie.page.waitFor('.component-call .call-options')
    // Verify charlie is talking to bob.
    // const charlieNumber = await utils.getText(charlie, '.component-call .info-number')
    // t.equal(brand.tests.bob.number, charlieNumber, 'charlie sees bob\'s number')
    // // Verify bob is still talking to alice.
    // const bobNumberAfterTransfer = await utils.getText(bob, '.component-call .info-number')
    // t.equal(brand.tests.alice.number, bobNumberAfterTransfer, 'bob still sees alice\'s number')
    // // Alice's call should be ended now.
    // await alice.page.waitFor('.component-call .new-call')

    // step('bob', 'hangs up')
    // await bob.page.click('.component-call .test-button-terminate')
    // // Wait for all actors to return to the keypad.
    // await bob.page.waitFor('.component-call .new-call')
    // await charlie.page.waitFor('.component-call .new-call')
})
