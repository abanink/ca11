const path = require('path')

module.exports = function(settings) {
    const brand = settings.brands[settings.BRAND_TARGET]

    return async function(runner, screens) {
        const container = await runner.$('#app')
        if (screens) await container.screenshot({path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}wizard-welcome.png`)})

        await runner.click('.test-wizard-welcome-next')

        await runner.waitFor('.component-wizard-telemetry')
        if (screens) await container.screenshot({path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}wizard-telemetry.png`)})

        await runner.click('.test-wizard-telemetry-yes')

        await runner.waitFor('.component-wizard-mic-permission')
        if (screens) await container.screenshot({path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}wizard-mic-permission.png`)})
        await runner.click('.test-wizard-mic-permission-next')

        await runner.waitFor('.component-wizard-devices')
        await runner.waitFor('select option:not([disabled="disabled"])')

        let [input, output, sounds] = await Promise.all([
            runner.$$('#input_device option'),
            runner.$$('#output_device option'),
            runner.$$('#sounds_device option'),
        ])

        if (screens) await container.screenshot({path: path.join(settings.SCREENS_DIR, `${brand.tests.step(runner)}wizard-devices.png`)})
        await runner.click('.test-wizard-devices-next')

        await runner.waitFor('.notification')

        return {input, output, sounds}
    }

}
