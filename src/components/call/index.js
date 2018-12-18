module.exports = (app) => {
    app.components.CallMedia = Vue.component('CallMedia', require('./components/media')(app))
    app.components.CallOptions = Vue.component('CallOptions', require('./components/options')(app))
    app.components.CallTransfer = Vue.component('CallTransfer', require('./components/transfer')(app))

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
