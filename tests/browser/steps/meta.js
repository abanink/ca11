module.exports = function(_) {
    return {
        setupSip: async function(actor) {
            await _.step(actor, 'setup sip')
            await _.steps.session.new(actor)
            await _.steps.wizard.complete(actor)
            await _.steps.settings.enableSip(actor)
        },
    }
}
