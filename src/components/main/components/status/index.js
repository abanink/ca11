module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const MainStatus = {
        computed: app.helpers.sharedComputed(),
        data: function() {
            return {
                tooltip: {
                    sig11: '',
                    sip: '',
                },
            }
        },
        methods: Object.assign({
            classes: function(protocol) {
                let classes = {}
                let generalError = false
                let tooltip = ''

                // Handle common errors that affects any protocol.
                if (!this.settings.webrtc.media.permission) generalError = this.$t('no microphone access')
                else if (!this.settings.webrtc.devices.ready) generalError = this.$t('invalid audio device')
                else if (!this.app.online) generalError = this.$t('offline')

                // General errors are applied to all indicators.
                if (generalError) {
                    classes.error = true
                    tooltip = generalError.ca()
                }

                if (!this[protocol].enabled) {
                    classes.disabled = true
                    tooltip = this.$t('disabled')
                } else {
                    if (this[protocol].status === 'loading') tooltip = this.$t('loading')
                    else if (this[protocol].status === 'registered') {
                        if (this.dnd) {
                            classes.warning = true
                            tooltip = this.$t('do not disturb')
                        } else tooltip = this.$t('registered')

                        if (protocol === 'sip') {
                            tooltip += ` (${this.sip.account.selected.username})`
                        }
                    } else {
                        classes.error = true
                        if (this[protocol].status === 'disconnected') tooltip = this.$t('disconnected')
                        else if (this[protocol].status === 'registration_failed') tooltip = this.$t('failed to register')
                        else tooltip = this.$t(this[protocol].status) // Handle unknown status.
                    }
                }

                if (!classes.error && !classes.warning) classes.ok = true

                this.tooltip[protocol] = tooltip

                return classes
            },
            logout: app.helpers.logout,
        }, app.helpers.sharedMethods()),
        render: templates.main_status.r,
        staticRenderFns: templates.main_status.s,
        store: {
            app: 'app',
            dnd: 'availability.dnd',
            layer: 'ui.layer',
            settings: 'settings',
            sig11: 'sig11',
            sip: 'sip',
        },
    }

    return MainStatus
}
