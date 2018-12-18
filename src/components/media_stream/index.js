module.exports = (app) => {
    let intervalId
    /**
    * @memberof fg.components
    */
    const MediaStream = {
        methods: {
            classes: function(block) {
                let classes = {}
                if (block === 'component') {
                    classes.audio = (this.stream.kind === 'audio')
                    classes.selected = this.stream.selected
                    classes.video = (this.stream.kind === 'video')
                    if (this.stream.kind === 'video' && !this.stream.local) {
                        classes.hidden = !this.stream.visible
                    }
                }

                return classes
            },
            toggleSelect: function() {
                this.stream.selected = !this.stream.selected
            },
        },
        mounted: function() {
            const video = this.$refs[`stream-${this.stream.id}`]
            video.display = 'none'
            app.on('local-stream-ready', ({streamId}) => {
                if (streamId === this.stream.id) {
                    const streamElement = this.$refs[`stream-${streamId}`]
                    streamElement.srcObject = app.media.streams[streamId]
                }
            })

            // A remote video is only visible when it started playing.
            // This is mainly to hide Asterisk's ghost video track.
            if (!this.stream.local && this.stream.kind === 'video') {
                intervalId = setInterval(() => {
                    if (video.videoWidth < 10 || video.videoHeight < 10) {
                        this.stream.visible = false
                    } else {
                        this.stream.visible = true
                        clearInterval(intervalId)
                    }
                }, 250)
            }

            const streamElement = this.$refs[`stream-${this.stream.id}`]
            streamElement.srcObject = app.media.streams[this.stream.id]
        },
        props: ['stream'],
        render: templates.media_stream.r,
        staticRenderFns: templates.media_stream.s,
    }

    return MediaStream
}
