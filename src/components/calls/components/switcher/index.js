module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const Switcher = {
        computed: app.helpers.sharedComputed(),
        methods: Object.assign({
            activateCall: function(call) {
                app.setState({ui: {layer: 'calls'}})
                if (call) {
                    app.emit('bg:calls:call_activate', {
                        callId: call.id,
                        holdInactive: false,
                        unholdActive: false,
                    })
                } else {
                    app.emit('bg:calls:call_activate', {callId: null})
                }

            },
            callIcon: function(call) {
                if (['answered_elsewhere', 'bye', 'request_terminated', 'callee_busy'].includes(call.status)) {
                    return 'call-end'
                } else {
                    if (call.hold.active) return 'call-hold'
                    else return 'call-active'
                }
            },
            callTitle: function(call) {
                const translations = app.helpers.getTranslations().call
                if (call.status === 'new') {
                    if (call.active) return this.$t('close new call').ca()
                    else return `${this.$t('select new call')}`.ca()
                } else {
                    let text = `${call.endpoint} - `
                    if (call.status === 'accepted') {
                        if (call.hold.active) text += translations[call.status].hold
                        else text += translations[call.status][call.type]
                    } else {
                        text += translations[call.status]
                    }

                    return text.ca()
                }
            },
            newCallAllowed: function() {
                let allowed = true
                for (let callId of Object.keys(this.calls)) {
                    if (['new', 'create', 'invite'].includes(this.calls[callId].status)) {
                        allowed = false
                    }
                }
                return allowed
            },
            placeCall: function() {
                // This method is also called on enter. The keypad may
                // be in dtmf mode at that moment; block the call request.
                if (!this.mode === 'call') return
                app.emit('bg:calls:call_create', {description: this.call, start: false, transfer: false})
            },
        }, app.helpers.sharedMethods()),
        render: templates.calls_switcher.r,
        staticRenderFns: templates.calls_switcher.s,
        store: {
            calls: 'calls.calls',
            description: 'calls.description',
            ui: 'ui',
            user: 'user',
        },
    }

    return Switcher
}
