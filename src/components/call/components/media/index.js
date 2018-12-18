module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const Media = {
        computed: {
            selectedStreams: function() {
                return Object.values(this.call.streams).filter((i) => i.selected)
            },
        },
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
        render: templates.call_media.r,
        staticRenderFns: templates.call_media.s,
        store: {
            stream: 'settings.webrtc.media.stream',
        },
    }

    return Media
}
