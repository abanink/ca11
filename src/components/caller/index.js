module.exports = (app) => {
    app.components.CallsSwitcher = Vue.component('CallsSwitcher', require('./components/switcher')(app))
    /**
    * @memberof fg.components
    */
    const Caller = {
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
                    if (this.callOngoing) classes['t-st-caller-ongoing'] = true
                    else classes['t-st-caller-idle'] = true
                }
                return classes
            },
            toggleNodeView: function() {
                app.setState({sig11: {
                    network: {view: !this.sig11.network.view}},
                }, {persist: true})
            },
        }, app.helpers.sharedMethods()),
        render: templates.caller.r,
        staticRenderFns: templates.caller.s,
        store: {
            calls: 'caller.calls',
            description: 'caller.description',
            sig11: 'sig11',
            sip: 'sip',
            stream: 'settings.webrtc.media.stream',
            ui: 'ui',
        },
        watch: {
            'description.protocol': function(protocol) {
                app.setState({caller: {description: {
                    endpoint: '',
                    protocol,
                }}}, {persist: true})
            },
        },
    }

    return Caller
}
