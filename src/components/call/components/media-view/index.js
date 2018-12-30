module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const CallMediaView = {
        computed: Object.assign({
            selectedStreams: function() {
                let streams = []
                if (this.stream[this.stream.type].selected) streams.push(this.stream[this.stream.type])
                const callStreams = Object.values(this.call.streams).filter((i) => i.selected)
                streams = streams.concat(callStreams)
                return streams
            },
        }, app.helpers.sharedComputed()),
        methods: {
            classes: function(block) {
                const classes = {}
                if (block === 'component') {
                    classes[`x${this.selectedStreams.length}`] = true
                }
                return classes
            },
        },
        mounted: function() {
            // Start with a selected local stream.
            this.stream.selected = true
        },
        props: ['call'],
        render: templates.call_media_view.r,
        staticRenderFns: templates.call_media_view.s,
        store: {
            stream: 'settings.webrtc.media.stream',
        },
    }

    return CallMediaView
}
