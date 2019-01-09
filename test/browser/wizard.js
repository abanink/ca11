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
module.exports = function(settings) {
    const brand = settings.brands[settings.BRAND_TARGET]

    return async function(runner, screens) {
        // Welcome:
        const container = await runner.$('.t-main')
        if (screens) await container.screenshot({path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}wizard-welcome.png`)})
        await runner.click('.t-btn-welcome-next')

        // Media Permissions:
        await runner.waitFor('.t-media-permission')
        if (screens) await container.screenshot({path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}wizard-media-permission.png`)})
        await runner.click('.t-media-permission-next')

        // Devices:
        await runner.waitFor('.t-devices')
        await runner.waitFor('.t-sel-headset-input .option')
        if (screens) await container.screenshot({path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}wizard-devices.png`)})
        let [input, output, sounds] = await Promise.all([
            runner.$$('.t-sel-headset-input .option'),
            runner.$$('.t-sel-headset-output .option'),
            runner.$$('.t-sel-ring-output .option'),
        ])

        await runner.click('.t-btn-devices-next')

        // Telemetry consent:
        await runner.waitFor('.t-telemetry')
        if (screens) await container.screenshot({path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}wizard-telemetry.png`)})
        await runner.click('.t-btn-telemetry-next-yes')
        await runner.waitFor('.notification')

        return {input, output, sounds}
    }

}
