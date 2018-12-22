module.exports = (app) => {
    app.components.CallMediaPreview = Vue.component('CallMediaPreview', require('./components/media-preview')(app))
    app.components.CallMediaView = Vue.component('CallMediaView', require('./components/media-view')(app))
    app.components.CallOptions = Vue.component('CallOptions', require('./components/options')(app))
    app.components.CallStatus = Vue.component('CallStatus', require('./components/status')(app))
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
