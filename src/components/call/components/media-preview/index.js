module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const CallMediaPreview = {
        computed: Object.assign({
            selectedStreams: function() {
                return Object.values(this.call.streams).filter((i) => i.selected)
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
            toggleSelect: function(stream) {
                stream.selected = !stream.selected
            },
        },
        mounted: function() {
            // Start with a selected local stream.
            this.stream.selected = true
        },
        props: ['call'],
        render: templates.call_media_preview.r,
        staticRenderFns: templates.call_media_preview.s,
        store: {
            stream: 'settings.webrtc.media.stream',
        },
    }

    return CallMediaPreview
}
