module.exports = (app) => {
    app.components.CallsSwitcher = Vue.component('CallsSwitcher', require('./components/switcher')(app))
    /**
    * @memberof fg.components
    */
    const Calls = {
        computed: Object.assign({
            protocols: function() {
                let protocols = [
                    {disabled: !this.sig11.enabled, name: 'sig11', value: 'sig11'},
                    {disabled: !this.sip.enabled, name: 'sip', value: 'sip'},
                ]
                return protocols
            },
        }, app.helpers.sharedComputed()),
        methods: Object.assign({
            classes: function(block) {
                let classes = {}
                if (block === 'component') {
                    if (this.callOngoing) classes['t-st-calls-ongoing'] = true
                    else classes['t-st-calls-idle'] = true
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
