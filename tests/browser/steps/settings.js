module.exports = function(_) {
    return {
        enableSip: async function(actor) {
            const {page} = actor
            await page.waitFor('.t-btn-settings')
            await page.click('.t-btn-settings')
            await page.waitFor('.t-settings')

            await page.click('.t-tab-sip')
            await page.click('.t-cb-sip-toggled')

            await page.type('.t-txt-sip-username', actor.sip.username)
            await page.type('.t-txt-sip-password', actor.sip.password)

            await _.screenshot(actor, 'enable-sip')

            await page.click('.t-btn-settings-save')
            // Wait until the status indicates a registered device.
            await page.waitFor('.t-st-status-sip-registered')
            // Go back to calls layer and switch to sip calling.
            await page.click('.t-btn-menu-calls')
            await page.click('.t-rd-calls-protocol-sip')

        },
    }
}
