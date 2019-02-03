module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const Switcher = {
        computed: app.helpers.sharedComputed(),
        methods: Object.assign({
            activateCall: function(call) {
                app.setState({settings: {webrtc: {media: {stream: {
                    [this.stream.type]: {selected: false},
                }}}}, ui: {layer: 'caller'}}, {persist: true})

                if (call) {
                    app.emit('caller:call-activate', {
                        callId: call.id,
                        holdInactive: false,
                        unholdActive: false,
                    })
                } else {
                    app.emit('caller:call-activate', {callId: null})
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
                app.emit('caller:call-add', {description: this.call, start: false, transfer: false})
            },
        }, app.helpers.sharedMethods()),
        render: templates.caller_switcher.r,
        staticRenderFns: templates.caller_switcher.s,
        store: {
            calls: 'caller.calls',
            description: 'caller.description',
            stream: 'settings.webrtc.media.stream',
            ui: 'ui',
        },
    }

    return Switcher
}
