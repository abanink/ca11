const path = require('path')

module.exports = function(settings) {
    const brand = settings.brands[settings.BRAND_TARGET]

    return {
        answerCall: async function({caller, callee}, screens) {
            const calleeContainer = await callee.$('.t-main')
            const callerContainer = await caller.$('.t-main')

            await callee.waitFor('.t-st-calls-ongoing')
            if (screens) {
                await calleeContainer.screenshot({
                    path: path.join(settings.SCREENS_DIR, `${brand.tests.step(callee)}call-invite.png`),
                })
            }
            await callee.click('.t-btn-options-call-accept')
            // Alice and bob are now getting connected;
            // wait for Alice to see the connected screen.
            await caller.waitFor('.t-btn-media-stream-video')
            await callee.waitFor('.t-btn-media-stream-video')

            await caller.click('.t-btn-media-stream-video')
            await callee.click('.t-btn-media-stream-video')

            if (screens) {
                await callerContainer.screenshot({
                    path: path.join(settings.SCREENS_DIR, `${brand.tests.step(caller)}calling.png`),
                })
                await calleeContainer.screenshot({
                    path: path.join(settings.SCREENS_DIR, `${brand.tests.step(callee)}calling.png`),
                })
            }
        },
        callNumber: async function(runner, screens, number) {
            const container = await runner.$('.t-main')

            // Enter a number and press the call button.
            await runner.click('.t-btn-menu-calls')
            await runner.waitFor('.t-keypad')

            // Test by clicking the dialpad buttons.
            for (const n of String(number).split('')) {
                await runner.click(`.t-btn-keypad-${n}`)
            }

            if (screens) {
                await container.screenshot({
                    path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}dial-${number}.png`),
                })
            }

            await runner.click('.t-btn-options-call-start')
            // await runner.waitFor('.t-st-call-invite')
            // await caller.click('.t-btn-media-stream-video')
            if (screens) {
                await container.screenshot({
                    path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}call-${number}.png`),
                })
            }

        },
    }
}
