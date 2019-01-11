module.exports = function(_) {
    return {
        new: async function(actor) {
            const {page} = actor

            await _.step(actor, 'creating new session')
            await page.waitFor('.t-login')
            _.screenshot(actor, 'new-session')
            await page.type('.t-txt-session-id', actor.session.username)
            await page.type('.t-txt-session-pw', actor.session.password)
            _.screenshot(actor, 'new-session-input')
            await page.click('.t-btn-login')
            await page.waitFor('.t-wizard')
        },
    }
}
