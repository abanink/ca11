module.exports = (app) => {
    app.components.CallsSwitcher = Vue.component('CallsSwitcher', require('./components/switcher')(app))
    /**
    * @memberof fg.components
    */
    const Calls = {
        computed: Object.assign({
            keypadEnabled: function() {
                if (this.callingDisabled) return false
                if (this.sip.enabled && !['loading', 'registered'].includes(this.sip.status)) return false
                if (this.sig11.enabled && !['loading', 'registered'].includes(this.sig11.status)) return false
                return true
            },
            protocols: function() {
                let protocols = [
                    {disabled: !this.sip.enabled, name: 'sip', value: 'sip'},
                    {disabled: !this.sig11.enabled, name: 'sig11', value: 'sig11'},
                ]
                return protocols
            },
        }, app.helpers.sharedComputed()),
        methods: Object.assign({
            classes: function(block) {
                let classes = {}
                if (block === 'component') {
                    if (this.callOngoing) classes['call-ongoing'] = true
                }
                return classes
            },
        }, app.helpers.sharedMethods()),
        render: templates.calls.r,
        staticRenderFns: templates.calls.s,
        store: {
            calls: 'calls.calls',
            description: 'calls.description',
            sig11: 'calls.sig11',
            sip: 'calls.sip',
            ui: 'ui',
        },
    }

    return Calls
}
