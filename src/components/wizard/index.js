module.exports = (app) => {
    // Initialize sub-components for the wizard.
    const shared = function() {
        return {
            methods: {
                finishWizard: function() {
                    app.setState({settings: {wizard: {completed: true}}}, {persist: true})
                    app.notify({
                        icon: 'protocol-sig11',
                        message: this.$t('enjoy secure calling on the SIG11 network!', {name: this.app.name}),
                        type: 'info',
                    })
                },
                stepBack: function() {
                    const stepIndex = this.options.findIndex((option) => option.name === this.selected.name)
                    app.setState({settings: {wizard: {steps: {selected: this.options[stepIndex - 1]}}}}, {persist: true})
                },
                stepBackFirst: function() {
                    app.helpers.logout()
                },
                stepNext: function() {
                    const stepIndex = this.options.findIndex((option) => option.name === this.selected.name)
                    app.setState({settings: {wizard: {steps: {selected: this.options[stepIndex + 1]}}}}, {persist: true})
                },
            },
        }
    }

    app.components.WizardDevices = Vue.component('WizardDevices', require('./components/devices')(app, shared))
    app.components.WizardMediaPermission = Vue.component('WizardMediaPermission', require('./components/media-permission')(app, shared))
    app.components.WizardTelemetry = Vue.component('WizardTelemetry', require('./components/telemetry')(app, shared))
    app.components.WizardWelcome = Vue.component('WizardWelcome', require('./components/welcome')(app, shared))
    /**
    * @memberof fg.components
    */
    const Wizard = {
        computed: app.helpers.sharedComputed(),
        created: function() {
            if (!this.calls.sip.account.selection) {
                app.setState({
                    settings: {
                        wizard: {steps: {options: this.steps.options.filter((step) => step.name !== 'WizardAccount')}},
                    },
                }, {persist: true})
            }
        },
        render: templates.wizard.r,
        staticRenderFns: templates.wizard.s,
        store: {
            app: 'app',
            calls: 'calls',
            settings: 'settings',
            steps: 'settings.wizard.steps',
            user: 'user',
        },
    }

    return Wizard
}
