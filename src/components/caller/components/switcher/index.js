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
                if (['answered_elsewhere', 'bye', 'caller_unavailable', 'callee_busy'].includes(call.status)) {
                    return 'call-end'
                } else {
                    if (call.hold.active) return 'call-hold'
                    else return 'call-active'
                }
            },
            callTitle: function(call) {
                const translations = app.helpers.getTranslations().call
                let text = `${call.number} - `
                if (call.hold.active) text += translations.hold
                text += translations[call.status]
                return text.ca()
            },
            newCallAllowed: function() {
                let allowed = true
                for (let callId of Object.keys(this.calls)) {
                    if (['create', 'invite'].includes(this.calls[callId].status)) {
                        allowed = false
                    }
                }
                return allowed
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
