module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const Options = {
        methods: {
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
            transferFinalize: function() {
                app.emit('bg:calls:transfer_finalize', {callId: this.call.id})
            },
            transferToggle: function() {
                if (this.call.transfer.disabled) return
                app.emit('bg:calls:transfer_toggle', {callId: this.call.id})
            },
        },
        props: ['call'],
        render: templates.call_options.r,
        staticRenderFns: templates.call_options.s,
    }

    return Options
}
