module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const MainStatusbar = {
        computed: app.helpers.sharedComputed(),
        data: function() {
            return {
                tooltip: '',
            }
        },
        methods: Object.assign({
            classes: function() {
                let classes = {}
                let tooltips = []

                if (!this.settings.webrtc.media.permission) {
                    classes.error = true
                    tooltips.push(this.$t('no microphone access'))
                } else if (!this.settings.webrtc.devices.ready) {
                    classes.error = true
                    tooltips.push(this.$t('invalid audio device'))
                } else if (this.dnd) {
                    classes.warning = true
                    tooltips.push(this.$t('do not disturb'))
                } else {
                    // Although the SIG11 protocol can be switched off,
                    // we presume the protocol is always switched on when
                    // building this tooltip.
                    if (this.sig11.enabled) {
                        if (this.sig11.status === 'loading') {
                            tooltips.push(`SIG11: ${this.$t('loading')}`)
                        } else if (this.sig11.status === 'connected') {
                            tooltips.push(`SIG11: ${this.$t('connected')}`)
                        } else {
                            classes.error = true
                            if (!this.app.online) tooltips.push(this.$t('offline'))
                            else tooltips.push(this.$t('no connection'))
                        }
                    }

                    if (this.sip.enabled) {
                        if (this.sip.status === 'loading') {
                            tooltips.push(`SIP: ${this.$t('loading')}`)
                        } else if (this.sip.status === 'registered') {
                            classes['test-status-sip-registered'] = true
                            tooltips.push(`SIP: ${this.$t('registered')} (${this.sip.account.selected.username})`)
                        } else {
                            classes.error = true
                            if (this.sip.status === 'registration_failed') {
                                tooltips.push(`SIP: ${this.$t('registration failed')}`)
                            }
                        }
                    }


                    if (!classes.error || classes.warning) classes.ok = true
                }

                this.tooltip = tooltips.join(', ')
                return classes
            },
            logout: app.helpers.logout,
        }, app.helpers.sharedMethods()),
        render: templates.main_statusbar.r,
        staticRenderFns: templates.main_statusbar.s,
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

    return MainStatusbar
}
