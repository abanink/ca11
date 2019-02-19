module.exports = (app) => {

    const MediaControls = {
        computed: {
            callsExist: app.helpers.sharedComputed().callsExist,
        },
        methods: {
            toggleSelect: function() {
                let selected = this.stream[this.stream.type].selected
                if (!selected) selected = new Date().getTime()
                else selected = null
                app.setState({
                    settings: {webrtc: {media: {stream: {[this.stream.type]: {selected}}}}},
                    ui: {layer: 'caller'},
                }, {persist: true})
            },
        },
        props: ['call'],
        render: templates.media_controls.r,
        staticRenderFns: templates.media_controls.s,
        store: {
            calls: 'caller.calls',
            stream: 'settings.webrtc.media.stream',
        },
    }

    return MediaControls
}
