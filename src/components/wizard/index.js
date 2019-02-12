module.exports = (app) => {
    // Initialize sub-components for the wizard.
    const shared = function() {
        return {
            methods: {
                finishWizard: function() {
                    app.setState({settings: {wizard: {completed: true}}}, {persist: true})
                },
                stepBack: function() {
                    const stepIndex = this.options.findIndex((option) => option.name === this.selected.name)
                    app.setState({settings: {wizard: {steps: {selected: this.options[stepIndex - 1]}}}}, {persist: true})
                },
                stepBackFirst: function() {
                    app.session.close()
                },
                stepNext: function() {
                    const stepIndex = this.options.findIndex((option) => option.name === this.selected.name)
                    app.setState({settings: {wizard: {steps: {selected: this.options[stepIndex + 1]}}}}, {persist: true})
                },
            },
        }
    }

    const components = {
        WizardDevices: require('./components/devices'),
        WizardMediaPermission: require('./components/media-permission'),
        WizardProtocolHandler: require('./components/protocol-handler'),
        WizardSig11: require('./components/sig11'),
        WizardTelemetry: require('./components/telemetry'),
    }

    for (const [name, component] of Object.entries(components)) {
        app.components[name] = Vue.component(name, component(app, shared))
    }

    /**
    * @memberof fg.components
    */
    const Wizard = {
        computed: app.helpers.sharedComputed(),
        created: function() {
            // Protocol handling is not supported on Android.
            if (app.env.isAndroid) {
                app.setState({
                    settings: {wizard: {steps: {
                        options: this.steps.options.filter((step) => step.name !== 'WizardProtocolHandler'),
                    }}},
                }, {persist: true})
            }
        },
        render: templates.wizard.r,
        staticRenderFns: templates.wizard.s,
        store: {
            steps: 'settings.wizard.steps',
        },
    }

    return Wizard
}
