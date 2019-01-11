module.exports = function(_) {
    return {
        complete: async function(actor) {
            const {page} = actor
            // 1. Welcome:
            _.screenshot(actor, 'wizard-welcome')
            await page.click('.t-btn-welcome-next')

            // 2. Media Permissions:
            await page.waitFor('.t-media-permission')
            _.screenshot(actor, 'wizard-media-permission')
            await page.click('.t-media-permission-next')

            // 3. Devices:
            await page.waitFor('.t-devices')
            await page.waitFor('.t-sel-headset-input .option')

            _.screenshot(actor, 'wizard-devices')

            let [input, output, sounds] = await Promise.all([
                page.$$('.t-sel-headset-input .option'),
                page.$$('.t-sel-headset-output .option'),
                page.$$('.t-sel-ring-output .option'),
            ])

            await page.click('.t-btn-devices-next')

            // 4. Telemetry consent:
            await page.waitFor('.t-telemetry')

            _.screenshot(actor, 'wizard-telemetry')

            await page.click('.t-btn-telemetry-next-yes')
            await page.waitFor('.notification')

            return {input, output, sounds}
        },
    }

}
