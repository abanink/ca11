const path = require('path')
/**
 * The wizard user flow is:
 *  - Welcome
 *  - Media Permissions
 *  - Devices
 *  - Telemetry consent
 *  - CA11 ready
 * @param {Object} settings - Project settings.
 * @returns {Object} - input/output/sounds.
 */
module.exports = function(_) {
    return {
        complete: async function(actor) {
            const {page} = actor
            // Welcome:
            _.screenshot(actor, 'wizard-welcome')
            await page.click('.t-btn-welcome-next')

            // Media Permissions:
            await page.waitFor('.t-media-permission')
            _.screenshot(actor, 'wizard-media-permission')
            await page.click('.t-media-permission-next')

            // Devices:
            await page.waitFor('.t-devices')
            await page.waitFor('.t-sel-headset-input .option')

            _.screenshot(actor, 'wizard-devices')

            let [input, output, sounds] = await Promise.all([
                page.$$('.t-sel-headset-input .option'),
                page.$$('.t-sel-headset-output .option'),
                page.$$('.t-sel-ring-output .option'),
            ])

            await page.click('.t-btn-devices-next')

            // Telemetry consent:
            await page.waitFor('.t-telemetry')

            _.screenshot(actor, 'wizard-telemetry')

            await page.click('.t-btn-telemetry-next-yes')
            await page.waitFor('.notification')

            return {input, output, sounds}
        },
    }

}
