const path = require('path')

module.exports = function(settings) {
    const brand = settings.brands[settings.BRAND_TARGET]

    return {
        enableSip: async function(runner, screens) {
            await runner.click('.test-statusbar-settings')
            await runner.waitFor('.component-settings')

            await runner.click('.test-tab-phone')

            await runner.click('input[name="sip_enabled"')

            await runner.type('input[name="sip_endpoint"]', brand.tests[runner._name].endpoint)
            await runner.type('input[name="sip_username"]', brand.tests[runner._name].username)
            await runner.type('input[name="sip_password"]', brand.tests[runner._name].password)

            if (screens) {
                const container = await runner.$('#app')
                await container.screenshot({path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}login.png`)})
            }

            await runner.click('.test-settings-save')
            // Wait until the status indicates a registered device.
            await runner.waitFor('.test-status-sip-registered')
            await runner.click('.test-delete-notification')
        },
    }
}
