module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const MediaStream = {
        methods: {
            classes: function(block) {
                let classes = {}
                if (block === 'component') {
                    classes.audio = (this.stream.kind === 'audio')
                    classes.video = (this.stream.kind === 'video')
                }

                return classes
            },
            toggleSelect: function() {
                this.stream.selected = !this.stream.selected
            },
        },
        mounted: function() {
            const streamElement = this.$refs[`stream-${this.stream.id}`]
            streamElement.srcObject = app.media.streams[this.stream.id]
        },
        props: ['stream'],
        render: templates.media_stream.r,
        staticRenderFns: templates.media_stream.s,
    }

    return MediaStream
}
