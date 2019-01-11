module.exports = function(_) {

    return {
        answerActor: async function(callee, caller) {
            await _.step(callee, `answers call from ${caller.session.username}`)
            await callee.page.waitFor('.t-st-calls-ongoing')
            await _.screenshot(callee, `call-invite-from-${caller.session.username}`)

            await callee.page.click('.t-btn-options-call-accept')
            // Alice and bob are now getting connected;
            // wait for Alice to see the connected screen.
            await caller.page.waitFor('.t-btn-media-stream-video')
            await callee.page.waitFor('.t-btn-media-stream-video')

            await caller.page.click('.t-btn-media-stream-video')
            await callee.page.click('.t-btn-media-stream-video')

            await _.screenshot(caller, `calling-with-${callee.session.username}`)
            await _.screenshot(callee, `calling-with-${caller.session.username}`)
        },
        callActor: async function(caller, callee) {
            await _.step(caller, `calls ${callee.session.username}`)

            // Enter a number and press the call button.
            await caller.page.click('.t-btn-menu-calls')
            await caller.page.waitFor('.t-keypad')

            // Test by clicking the dialpad buttons.
            for (const n of String(callee.sip.username).split('')) {
                await caller.page.click(`.t-btn-keypad-${n}`)
            }

            await _.screenshot(caller, `dialing-${callee.session.username}`)
            await caller.page.click('.t-btn-options-call-start')
            await _.screenshot(caller, `calling-${callee.session.username}`)
        },
        /**
         * Assumes caller and callee are already in a call
         * with each other.
         * @param {*} caller - The caller actor.
         * @param {*} callee - The callee actor.
         * @param {*} transfer - The transfer actor.
         */
        transferActor: async function(caller, callee, transfer) {
            // Alice blind transfers to Charlie.
            _.step(callee, `transfer ${caller.session.username} to ${transfer.session.username}`)
            await callee.page.waitFor('.t-btn-options-transfer-toggle:not([disabled])')
            await callee.page.click('.t-btn-options-transfer-toggle')
            // Pick blind (unattended) transfer.
            await callee.page.click('.t-btn-transfer-attended')

            // Focus number input
            await callee.page.click('.t-txt-dialer-number')
            await callee.page.type('.t-txt-dialer-number', transfer.sip.username)
            await _.screenshot(callee, `transfers-${caller.session.username}-to-${transfer.session.username}-attended`)

            await callee.page.click('.t-btn-dialer-call')

            await transfer.page.waitFor('.t-btn-options-call-accept')
            await transfer.page.click('.t-btn-options-call-accept')

            _.step(transfer, `accepted incoming call from ${callee.session.username}`)

            await callee.page.waitFor('.t-btn-options-transfer-finalize')
            await callee.page.click('.t-btn-options-transfer-finalize')
        },
    }
}
