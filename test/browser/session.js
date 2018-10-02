const path = require('path')

module.exports = function(settings) {
    const brand = settings.brands[settings.BRAND_TARGET]

    return {
        new: async function(runner, screens) {
            const container = await runner.$('#app')
            await runner.waitFor('.greeting')
            if (screens) await container.screenshot({path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}login.png`)})

            await runner.type('input[name="username"]', brand.tests[runner._name].username)
            await runner.type('input[name="password"]', brand.tests[runner._name].password)
            if (screens) await container.screenshot({path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}login-credentials.png`)})

            await runner.click('.test-login-button')
            await runner.waitFor('.component-wizard-welcome')
        },
    }
}
