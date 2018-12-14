module.exports = (app) => {
    app.components.CallMedia = Vue.component('CallMedia', require('./components/media')(app))
    app.components.CallOptions = Vue.component('CallOptions', require('./components/options')(app))
    app.components.CallTransfer = Vue.component('CallTransfer', require('./components/transfer')(app))

    /**
    * @memberof fg.components
    */
    const Call = {
        computed: Object.assign({
            // If the current call is in transfer mode.
            callCanTerminate: function() {
                if (this.call.hangup.disabled) return false
                if (this.call.transfer.active) return false
                if (!['accepted', 'create', 'invite'].includes(this.call.status)) return false
                if (this.call.keypad.active) return false
                return true
            },
        }, app.helpers.sharedComputed()),
        data: function() {
            return {
                intervalId: 0,
                keypad: false,
            }
        },
        destroyed: function() {
            clearInterval(this.intervalId)
        },
        methods: {
            callAccept: function(call) {
                app.emit('bg:calls:call_accept', {callId: call.id})
            },
            callTerminate: function(call) {
                app.emit('bg:calls:call_terminate', {callId: call.id})
            },
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
