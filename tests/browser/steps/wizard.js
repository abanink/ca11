module.exports = function(_) {
    return {
        complete: async function(actor) {
            await _.step(actor, 'complete wizard')
            const {page} = actor

            // 1. SIG11 network settings
            await page.waitFor('.t-sig11')

            // Empty auto-generated phonenumber.
            await page.click('.t-txt-sig11-number', {clickCount: 3})
            await page.keyboard.press('Backspace')
            await page.type('.t-txt-sig11-number', actor.sig11.number)

            await _.screenshot(actor, 'wizard-sig11', {only: 'alice'})
            await page.click('.t-btn-sig11-next')

            // 2. Click-to-dial Protocol handler
            await page.waitFor('.t-protocol-handler')
            await _.screenshot(actor, 'wizard-protocol-handler', {only: 'alice'})
            await page.click('.t-btn-protocol-handler-next')

            // 3. Media Permissions
            await page.waitFor('.t-media-permission')
            await _.screenshot(actor, 'wizard-media-permission', {only: 'alice'})
            await page.click('.t-btn-media-permission-next')

            // 4. Devices
            await page.waitFor('.t-devices')
            await page.waitFor('.t-sel-headset-input .option')
            await _.screenshot(actor, 'wizard-devices', {only: 'alice'})
            let [input, output, sounds] = await Promise.all([
                page.$$('.t-sel-headset-input .option'),
                page.$$('.t-sel-headset-output .option'),
                page.$$('.t-sel-ring-output .option'),
            ])
            await page.click('.t-btn-devices-next')

            // 5. Telemetry consent
            await page.waitFor('.t-telemetry')
            await _.screenshot(actor, 'wizard-telemetry', {only: 'alice'})
            await page.click('.t-btn-telemetry-next-yes')

            return {input, output, sounds}
        },
    }

}
