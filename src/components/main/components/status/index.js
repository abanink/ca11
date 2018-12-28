module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const MainStatus = {
        computed: app.helpers.sharedComputed(),
        data: function() {
            return {
                tooltipSig11: '',
                tooltipSip: '',
            }
        },
        methods: Object.assign({
            classes: function() {
                let classes = {}
                let generalError = false
                let tooltip = {sig11: '', sip: ''}

                // Handle common errors that affects any protocol.
                if (!this.settings.webrtc.media.permission) generalError = this.$t('no microphone access')
                else if (!this.settings.webrtc.devices.ready) generalError = this.$t('invalid audio device')
                else if (!this.app.online) generalError = this.$t('offline')

                if (generalError) {
                    classes.error = true
                    tooltip.sip = tooltip.sig11 = generalError.capitalize()
                } else {
                    if (!this.sip.enabled) tooltip.sip = this.$t('disabled')
                    else {
                        if (this.sip.status === 'loading') tooltip.sip = this.$t('loading')
                        else if (this.sip.status === 'registered') {
                            if (this.dnd) {
                                classes.warning = true
                                tooltip.sip = this.$t('do not disturb')
                            } else tooltip.sip = this.$t('registered')

                            tooltip.sip += ` (${this.sip.account.selected.username})`
                        } else {
                            classes.error = true
                            if (this.sip.status === 'disconnected') tooltip.sip = this.$t('disconnected')
                            else if (this.sip.status === 'registration_failed') tooltip.sip = this.$t('failed to register')
                            else tooltip.sip = this.$t(this.sip.status) // Handle unknown status.
                        }
                    }

                    if (!this.sig11.enabled) tooltip.sig11 = this.$t('disabled')
                    else {
                        if (this.sig11.status === 'loading') tooltip.sig11 = this.$t('loading')
                        else if (this.sig11.status === 'registered') {
                            if (this.dnd) {
                                classes.warning = true
                                tooltip.sig11 = this.$t('do not disturb')
                            } else tooltip.sig11 = this.$t('registered')
                        } else {
                            classes.error = true
                            if (this.sig11.status === 'disconnected') tooltip.sig11 = this.$t('disconnected')
                            else tooltip.sig11 = this.$t(this.sig11.status) // Handle unknown status.
                        }
                    }
                }

                this.tooltipSip = tooltip.sip.capitalize()
                this.tooltipSig11 = tooltip.sig11.capitalize()

                if (!classes.error && !classes.warning) classes.ok = true
                return classes
            },
            logout: app.helpers.logout,
        }, app.helpers.sharedMethods()),
        render: templates.main_status.r,
        staticRenderFns: templates.main_status.s,
        store: {
            app: 'app',
            dnd: 'availability.dnd',
            env: 'env',
            layer: 'ui.layer',
            settings: 'settings',
            sig11: 'calls.sig11',
            sip: 'calls.sip',
            user: 'user',
            vendor: 'app.vendor',
        },
    }

    return MainStatus
}
