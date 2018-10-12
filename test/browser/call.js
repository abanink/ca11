const path = require('path')

module.exports = function(settings) {
    const brand = settings.brands[settings.BRAND_TARGET]

    return {
        answerCall: async function({caller, callee}, screens) {
            const calleeContainer = await callee.$('#app')
            const callerContainer = await caller.$('#app')

            await callee.waitFor('.component-calls .call-ongoing')
            if (screens) {
                await calleeContainer.screenshot({
                    path: path.join(settings.SCREENS_DIR, `${brand.tests.step(callee)}calldialog-incoming.png`),
                })
            }
            await callee.click('.component-call .test-button-accept')
            // Alice and bob are now getting connected;
            // wait for Alice to see the connected screen.
            await caller.waitFor('.component-call .call-options')

            if (screens) {
                await callerContainer.screenshot({
                    path: path.join(settings.SCREENS_DIR, `${brand.tests.step(caller)}calldialog-outgoing-accepted.png`),
                })
            }
        },
        callNumber: async function(runner, screens, number) {
            const container = await runner.$('#app')

            // Enter a number and press the call button.
            await runner.click('.test-menubar-calls')
            await runner.waitFor('.component-calls')

            // Test by clicking the dialpad buttons.
            for (const n of String(number).split('')) {
                await runner.click(`.test-key-${n}`)
            }

            if (screens) {
                await container.screenshot({
                    path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}dialpad-call.png`),
                })
            }

            await runner.click('.test-call-button')
            await runner.waitFor('.component-calls .call-ongoing')
            if (screens) {
                await container.screenshot({
                    path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}calldialog-outgoing.png`),
                })
            }

        },
    }
}
