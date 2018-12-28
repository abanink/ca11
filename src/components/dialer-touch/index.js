module.exports = (app) => {

    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '#']

    /**
    * @memberof fg.components
    */
    const DialerTouch = {
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
                app.sounds.buttonTone.play()
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
        }, app.helpers.sharedMethods()),
        mounted: function() {
            // Only focus on desktop.
            if (!this.env.isAndroid) this.$refs.input.focus()
        },
        props: {
            call: {default: null},
            dtmf: {default: false, type: Boolean},
            endpoint: {default: '', type: String},
            mode: {default: 'call', type: String},
            search: {default: true, type: Boolean},
        },
        render: templates.dialer_touch.r,
        staticRenderFns: templates.dialer_touch.s,
        store: {
            calls: 'calls.calls',
            contacts: 'contacts.contacts',
            description: 'calls.description',
            env: 'env',
            sig11: 'calls.sig11',
            sip: 'calls.sip',
            ui: 'ui',
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

    return DialerTouch
}
