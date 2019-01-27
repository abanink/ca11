module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const StreamPreview = {
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
                if (!stream.selected) stream.selected = new Date().getTime()
                else stream.selected = null
            },
        },
        mounted: function() {
            // Start with a selected local stream.
            this.stream.selected = true
        },
        props: ['call'],
        render: templates.stream_preview.r,
        staticRenderFns: templates.stream_preview.s,
        store: {
            stream: 'settings.webrtc.media.stream',
        },
    }

    return StreamPreview
}
