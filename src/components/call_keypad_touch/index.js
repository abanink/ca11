module.exports = (app) => {

    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '#']

    // we detect the mouseup event on the window tag as opposed to the li
    // tag because otherwise if we release the mouse when not over a button,
    // the tone will remain playing.
    function stopKeypress() {
        if (app.sounds.dtmfTone.status) {
            window.setTimeout(() => {
                app.sounds.dtmfTone.stop()
            }, 50)
        }
    }

    document.addEventListener('mouseup', stopKeypress)
    document.addEventListener('touchend', stopKeypress)

    /**
    * @memberof fg.components
    */
    const CallKeypadTouch = {
        computed: Object.assign({
            matchedContact: function() {
                let _number = String(this.endpoint)
                if (_number.length > 1) {
                    let match = app.helpers.matchContact(String(this.endpoint), true)
                    if (match) {
                        return {
                            contact: this.contacts[match.contact],
                            endpoint: this.contacts[match.contact].endpoints[match.endpoint],
                        }
                    }
                }
                return null
            },
            protocols: function() {
                let protocols = [
                    {disabled: !this.sip.enabled, name: 'SIP', value: 'sip'},
                    {disabled: !this.sig11.enabled, name: 'SIG11', value: 'sig11'},
                ]
                return protocols
            },
        }, app.helpers.sharedComputed()),
        methods: Object.assign({
            classes: function(block) {
                let classes = {}
                if (block === 'component') {
                    classes['call-ongoing'] = true
                } else if (block === 'number-input') {
                    classes['number-input'] = true
                }
                return classes
            },
            inputChange: function(newVal) {
                this.$emit('update:model', newVal)
            },
            press: function(key) {
                if (!allowedKeys.includes(key)) return
                app.sounds.dtmfTone.play(key)
                // Force stop playing dtmf sound after x amount of time,
                // because mouseup event may not fire properly, in case of
                // a right-click => contextmenu.
                window.setTimeout(() => app.sounds.dtmfTone.stop(), 500)

                let newVal = app.utils.sanitizeNumber(`${this.endpoint}${key}`)
                if (newVal) this.$emit('update:model', newVal)
                if (this.mode === 'dtmf') {
                    app.emit('bg:calls:dtmf', {callId: this.call.id, key})
                }
            },
            removeLastNumber: function() {
                if (this.callingDisabled) return
                if (this.endpoint) this.$emit('update:model', this.endpoint.substring(0, this.endpoint.length - 1))
            },
            toggleVideo: function() {
                app.setState({calls: {description: {video: !this.description.video}}}, {persist: true})
            },
            unpress: function() {
                // No key pressed. Stop playing sound.
                window.setTimeout(() => app.sounds.dtmfTone.stop(), 50)
            },
            validateCall: function(description) {
                // Prevents calling without endpoint.
                if (!description.endpoint) return
                this.setupCall(description)
            },
        }, app.helpers.sharedMethods()),
        mounted: function() {
            this.$refs.input.focus()
        },
        props: {
            call: {default: null},
            dtmf: {default: false, type: Boolean},
            endpoint: {default: '', type: String},
            mode: {default: 'call', type: String},
            search: {default: true, type: Boolean},
        },
        render: templates.call_keypad_touch.r,
        staticRenderFns: templates.call_keypad_touch.s,
        store: {
            calls: 'calls.calls',
            contacts: 'contacts.contacts',
            description: 'calls.description',
            sig11: 'calls.sig11',
            sip: 'calls.sip',
            user: 'user',
        },
        watch: {
            'description.protocol': function(protocol) {
                app.setState({calls: {description: {protocol}}}, {persist: true})
            },
            endpoint: function(endpoint) {
                if (this.callingDisabled) return
                let cleanedNumber = endpoint
                if (this.description.protocol === 'sip') {
                    cleanedNumber = app.utils.sanitizeNumber(endpoint)
                }
                this.$emit('update:model', cleanedNumber)
            },
        },
    }

    return CallKeypadTouch
}
