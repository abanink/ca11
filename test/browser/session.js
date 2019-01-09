const path = require('path')

module.exports = function(settings) {
    const brand = settings.brands[settings.BRAND_TARGET]

    return {
        new: async function(runner, screens) {
            const container = await runner.$('.t-main')
            await runner.waitFor('.t-login')
            if (screens) {
                await container.screenshot({path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}login.png`)})
            }

            await runner.type('.t-txt-session-id', brand.tests[runner._name].username)
            await runner.type('.t-txt-session-pw', brand.tests[runner._name].password)
            if (screens) {
                await container.screenshot({path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}login-credentials.png`)})
            }

            await runner.click('.t-btn-login')
            await runner.waitFor('.t-wizard')
        },
    }
}
