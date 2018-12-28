module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const CallOptions = {
        computed: {
            // If the current call is in transfer mode.
            callCanTerminate: function() {
                if (!['accepted', 'create', 'invite'].includes(this.call.status)) return false
                return true
            },
        },
        methods: Object.assign({
            callAccept: function(call) {
                app.emit('bg:calls:call_accept', {callId: call.id})
            },
            callTerminate: function(call) {
                app.emit('bg:calls:call_terminate', {callId: call.id})
            },
            classes: function(block) {
                let classes = {}

                if (block === 'dialpad-button') {
                    classes.active = this.call.keypad.active && this.call.keypad.mode === 'dtmf'
                    classes.disabled = this.call.keypad.disabled || this.call.transfer.active
                } else if (block === 'hold-button') {
                    classes.active = this.call.hold.active
                    classes.disabled = this.call.hold.disabled
                } else if (block === 'mute-button') {
                    classes.active = this.call.mute.active
                } else if (block === 'transfer-button') {
                    classes.active = this.call.transfer.active
                    classes.disabled = this.call.transfer.disabled
                }
                return classes
            },
            holdToggle: function() {
                if (this.call.hold.disabled) return
                app.emit('bg:calls:hold_toggle', {callId: this.call.id})
            },
            keypadToggle: function() {
                // Keypad cannot be active during transfer.
                if (this.call.keypad.disabled || this.call.transfer.active) return
                const keypadOn = (!this.call.keypad.active || this.call.keypad.mode !== 'dtmf')
                app.setState(
                    {keypad: {active: keypadOn, display: 'touch', mode: 'dtmf'}},
                    {path: `calls.calls.${this.call.id}`}
                )
            },
            muteToggle: function() {
                app.emit('bg:calls:mute_toggle', {callId: this.call.id})
            },
            placeCall: function(description) {
                // Prevents calling without endpoint.
                if (!description.endpoint) return
                this.setupCall(description)
            },
            transferFinalize: function() {
                app.emit('bg:calls:transfer_finalize', {callId: this.call.id})
            },
            transferToggle: function() {
                if (this.call.transfer.disabled) return
                app.emit('bg:calls:transfer_toggle', {callId: this.call.id})
            },
        }, app.helpers.sharedMethods()),
        props: ['call'],
        render: templates.call_options.r,
        staticRenderFns: templates.call_options.s,
        store: {
            description: 'calls.description',
        },
    }

    return CallOptions
}
