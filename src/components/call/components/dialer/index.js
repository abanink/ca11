module.exports = (app) => {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '#']

    /**
    * @memberof fg.components
    */
    const Dialer = {
        computed: Object.assign({
            matchedContact: function() {
                let _number = String(this.number)
                if (_number.length > 1) {
                    let match = app.helpers.matchContact(String(this.number), true)
                    if (match) {
                        return {
                            contact: this.contacts[match.contact],
                            endpoint: this.contacts[match.contact].endpoints[match.number],
                        }
                    }
                }
                return null
            },
        }, app.helpers.sharedComputed()),
        methods: Object.assign({
            call: function(description) {
                app.plugins.caller.call({description})
            },
            classes: function() {
                return {
                    hint: true,
                }
            },
            inputChange: function(newVal) {
                this.$emit('update:model', newVal)
            },
            pressKey: function(key) {
                if (!allowedKeys.includes(key)) return

                let newVal = app.utils.sanitizeNumber(`${this.number}${key}`)
                if (newVal) this.$emit('update:model', newVal)
            },
            removeLastNumber: function() {
                if (this.callingDisabled) return
                if (this.number) {
                    this.$emit(
                        'update:model',
                        this.description.number.substring(0, this.number.length - 1),
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
            mode: {default: 'call', type: String},
            number: {default: '', type: String},
            search: {default: true, type: Boolean},
        },
        render: templates.call_dialer.r,
        staticRenderFns: templates.call_dialer.s,
        store: {
            contacts: 'contacts.contacts',
            description: 'caller.description',
            sig11: 'sig11',
            sip: 'sip',
        },
        watch: {
            number: function(endpoint) {
                if (this.callingDisabled) return
                let cleanedNumber = endpoint
                if (this.description.protocol === 'sip') {
                    cleanedNumber = app.utils.sanitizeNumber(endpoint)
                }
                this.$emit('update:model', cleanedNumber)
            },
        },
    }

    return Dialer
}
