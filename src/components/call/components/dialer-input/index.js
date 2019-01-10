module.exports = (app) => {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '#']

    /**
    * @memberof fg.components
    */
    const DialerInput = {
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
        }, app.helpers.sharedComputed()),
        methods: Object.assign({
            inputChange: function(newVal) {
                this.$emit('update:model', newVal)
            },
            pressKey: function(key) {
                if (!allowedKeys.includes(key)) return

                let newVal = app.utils.sanitizeNumber(`${this.endpoint}${key}`)
                if (newVal) this.$emit('update:model', newVal)
            },
            removeLastNumber: function() {
                if (this.callingDisabled) return
                if (this.endpoint) {
                    this.$emit(
                        'update:model',
                        this.description.endpoint.substring(0, this.endpoint.length - 1),
                    )
                }
            },
            unpressKey: function() {
                // No key pressed. Stop playing sound.
                window.setTimeout(() => app.sounds.dtmfTone.stop(), 50)
            },
        }, app.helpers.sharedMethods()),
        mounted: function() {
            this.$refs.input.focus()
        },
        props: {
            endpoint: {default: '', type: String},
            mode: {default: 'call', type: String},
            search: {default: true, type: Boolean},
        },
        render: templates.call_dialer_input.r,
        staticRenderFns: templates.call_dialer_input.s,
        store: {
            contacts: 'contacts.contacts',
            description: 'calls.description',
            sig11: 'calls.sig11',
            sip: 'calls.sip',
        },
        watch: {
            'call.protocol': function(protocol) {
                app.setState({calls: {call: {protocol}}}, {persist: true})
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

    return DialerInput
}