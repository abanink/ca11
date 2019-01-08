module.exports = (app) => {
    const components = {
        CallMediaPreview: require('./components/media-preview'),
        CallMediaView: require('./components/media-view'),
        CallOptions: require('./components/options'),
        CallStatus: require('./components/status'),
        CallTransfer: require('./components/transfer'),
        DialerInput: require('./components/dialer-input'),
        Keypad: require('./components/keypad'),
    }

    for (const [name, component] of Object.entries(components)) {
        app.components[name] = Vue.component(name, component(app))
    }


    /**
    * @memberof fg.components
    */
    const Call = {
        computed: app.helpers.sharedComputed(),
        data: function() {
            return {
                intervalId: 0,
                keypad: false,
            }
        },
        destroyed: function() {
            clearInterval(this.intervalId)
        },
        props: ['call'],
        render: templates.call.r,
        staticRenderFns: templates.call.s,
        store: {
            calls: 'calls.calls',
            description: 'calls.description',
        },
    }

    return Call
}
