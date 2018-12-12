module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const MediaStream = {
        mounted: function() {
            const streamElement = this.$refs[`stream-${this.stream.id}`]
            streamElement.srcObject = app.media.streams[this.stream.id]
        },
        props: {
            stream: {default: null},
        },
        render: templates.media_stream.r,
        staticRenderFns: templates.media_stream.s,
    }

    return MediaStream
}
