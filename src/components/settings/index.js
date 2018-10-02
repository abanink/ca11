module.exports = (app) => {

    const v = Vuelidate.validators

    /**
    * @memberof fg.components
    */
    const Settings = {
        methods: Object.assign({
            classes: function(block, modifier) {
                let classes = {}
                if (block === 'tabs') {
                    if (modifier === 'devices' && !this.settings.webrtc.enabled) classes.disabled = true
                    if (modifier === this.tabs.active) classes['is-active'] = true
                }
                return classes
            },
            save: function(e) {
                let settings = app.utils.copyObject(this.settings)
                app.setState({
                    availability: {dnd: false},
                    calls: {
                        sip: {
                            account: {
                                selected: app.state.calls.sip.account.selected,
                            },
                            enabled: app.state.calls.sip.enabled,
                            endpoint: app.state.calls.sip.endpoint,
                        },
                    },
                    language: this.language,
                    settings,
                }, {persist: true})
                app.emit('bg:calls:connect')

                // Update the vault settings.
                app.setState({app: {vault: this.app.vault}}, {encrypt: false, persist: true})
                app.notify({icon: 'settings', message: app.$t('settings are updated.'), type: 'success'})

                // Verify currently selected devices after saving settings again.
                app.emit('bg:devices:verify-sinks')
            },
        }, app.helpers.sharedMethods()),
        mounted: async function() {
            // Immediatly triger validation on the fields.
            this.$v.$touch()
        },
        render: templates.settings.r,
        staticRenderFns: templates.settings.s,
        store: {
            app: 'app',
            availability: 'availability',
            calls: 'calls',
            devices: 'settings.webrtc.devices',
            env: 'env',
            language: 'language',
            ringtones: 'settings.ringtones',
            settings: 'settings',
            tabs: 'ui.tabs.settings',
            user: 'user',
            vendor: 'app.vendor',
        },
        validations: function() {
            let validations = {
                // settings: {
                //     sip: {
                //         endpoint: {
                //             uri: {
                //                 domain: app.helpers.validators.domain,
                //                 required: v.required,
                //             },
                //         },
                //     },
                // },
            }
            // Add the validation that is shared with step_voipaccount, but
            // only if the user is supposed to choose between account options.
            if (this.calls.sip.account.selection) {
                validations.settings.sip.account = app.helpers.sharedValidations.bind(this)().settings.sip.account
            }

            return validations
        },
    }

    return Settings
}
