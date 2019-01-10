module.exports = function(_) {
    return {
        prepareSip: async function(actor) {
            await _.step(actor, 'preparing sip setup')
            await _.steps.session.new(actor)
            await _.steps.wizard.complete(actor)
            await _.steps.settings.enableSip(actor)
        },
    }
}
