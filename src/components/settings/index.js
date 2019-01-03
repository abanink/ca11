module.exports = (app) => {

    const v = Vuelidate.validators

    /**
    * @memberof fg.components
    */
    const Settings = {
        data: function() {
            return {
                playing: {
                    headsetOutput: false,
                    ringOutput: false,
                    speakerOutput: false,
                },
            }
        },
        methods: Object.assign({
            classes: function(block, modifier) {
                let classes = {}
                if (block === 'tabs') {
                    if (modifier === 'devices' && !this.settings.webrtc.enabled) classes.disabled = true
                    if (modifier === this.tabs.active) classes.active = true
                }
                return classes
            },
            save: function(e) {
                let settings = app.utils.copyObject(this.settings)
                delete settings.webrtc.media

                let settingsState = {
                    availability: {dnd: false},
                    calls: {
                        sig11: {
                            enabled: app.state.calls.sig11.toggled,
                            endpoint: app.state.calls.sig11.endpoint,
                            toggled: app.state.calls.sig11.toggled,
                        },
                        sip: {
                            account: {
                                selected: app.state.calls.sip.account.selected,
                            },
                            enabled: app.state.calls.sip.toggled,
                            endpoint: app.state.calls.sip.endpoint,
                            toggled: app.state.calls.sip.toggled,
                        },
                    },
                    language: this.language,
                    settings,
                }

                // Switch back to SIG11 as default call protocol when SIP is disabled.
                if (!this.calls.sip.enabled && this.calls.description.protocol === 'sip') {
                    settingsState.calls.description = {protocol: 'sig11'}
                }

                app.setState(settingsState, {persist: true})
                app.emit('bg:calls:connect')

                // Update the vault settings.
                app.setState({app: {vault: this.app.vault}}, {encrypt: false, persist: true})
                app.notify({icon: 'settings', message: app.$t('settings have been updated'), type: 'success'})

                // Verify currently selected devices after saving settings again.
                app.emit('bg:devices:verify-sinks')
            },
        }, app.helpers.sharedMethods()),
        mounted: async function() {
            // Immediatly trigger validation on the fields.
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
            media: 'settings.webrtc.media',
            ringtones: 'settings.ringtones',
            settings: 'settings',
            tabs: 'ui.tabs.settings',
            user: 'user',
            vendor: 'app.vendor',
        },
        validations: function() {
            let validations = {
                calls: {
                    sig11: {
                        endpoint: {
                            requiredIf: v.requiredIf(() => this.calls.sig11.toggled),
                        },
                    },
                    sip: {
                        account: {
                            selected: {
                                password: {
                                    requiredIf: v.requiredIf(() => this.calls.sip.toggled),
                                },
                                username: {
                                    requiredIf: v.requiredIf(() => this.calls.sip.toggled),
                                },
                            },
                        },
                        endpoint: {
                            requiredIf: v.requiredIf(() => this.calls.sip.toggled),
                        },
                    },
                },
            }

            return validations
        },
    }

    return Settings
}
