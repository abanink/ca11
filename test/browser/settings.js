const path = require('path')

module.exports = function(settings) {
    const brand = settings.brands[settings.BRAND_TARGET]

    return {
        enableSip: async function(runner, screens) {
            await runner.waitFor('.t-btn-settings')
            await runner.click('.t-btn-settings')
            await runner.waitFor('.t-settings')

            await runner.click('.t-tab-sip')
            await runner.click('.t-cb-sip-toggled')

            await runner.type('.t-txt-sip-username', brand.tests[runner._name].username)
            await runner.type('.t-txt-sip-password', brand.tests[runner._name].password)

            if (screens) {
                const container = await runner.$('.t-main')
                await container.screenshot({path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}enable-sip.png`)})
            }

            await runner.click('.t-btn-settings-save')
            // Wait until the status indicates a registered device.
            await runner.waitFor('.t-st-status-sip-registered')
            // Go back to calls layer and switch to sip calling.
            await runner.click('.t-btn-menu-calls')
            await runner.click('.t-rd-calls-protocol-sip')

        },
    }
}
