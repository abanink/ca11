module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    let localVideoElement

    app.on('media:local-stream-ready', () => {
        if (localVideoElement) {
            localVideoElement.src = window.URL.createObjectURL(app.localStream)
            localVideoElement.play()
        }
    })


    const Calls = {
        computed: Object.assign({
            callTypeSwitch: {
                get: function() {
                    if (this.callType === 'sig11') return true
                    else return false
                },
                set: function() {
                    if (this.callType === 'sip') {
                        app.setState({calls: {callType: 'sig11'}}, {persist: true})
                    }
                    else app.setState({calls: {callType: 'sip'}}, {persist: true})
                },
            },
            keypadEnabled: function() {
                // if (this.callingDisabled) return false
                console.log(this.sip.enabled, this.sip.status)
                if (this.sip.enabled && !['loading', 'registered'].includes(this.sip.status)) return false
                if (this.sig11.enabled && !['loading', 'registered'].includes(this.sig11.status)) return false
                return true
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
        mounted: function() {
            localVideoElement = this.$refs['local-video']

            if (app.localStream) {
                localVideoElement.src = window.URL.createObjectURL(app.localStream)
                localVideoElement.play()
            }
        },
        render: templates.calls.r,
        staticRenderFns: templates.calls.s,
        store: {
            calls: 'calls.calls',
            callType: 'calls.callType',
            sig11: 'calls.sig11',
            sip: 'calls.sip',
        },
    }

    return Calls
}
