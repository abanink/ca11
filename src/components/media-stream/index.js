module.exports = (app) => {
    // let intervalId
    /**
    * @memberof fg.components
    */
    const MediaStream = {
        // beforeDestroy: function() {
        //     if (intervalId) clearInterval()

        //     console.log("DESTROY:", intervalId)
        // },
        methods: {
            classes: function(block) {
                const classes = {
                    [this.stream.kind]: true,
                    selected: this.stream.selected,
                }

                classes[`t-btn-media-stream-${this.stream.kind}`] = true
                return classes
            },
            toggleSelect: function() {
                this.stream.selected = !this.stream.selected
            },
        },
        mounted: function() {
            // if (['display', 'video'].includes(this.stream.kind)) {
            //     this.$refs[this.stream.kind].display = 'none'

            //     // A remote video is only visible when it started playing.
            //     // This is mainly to hide Asterisk's ghost video track.
            //     if (!this.stream.local && this.stream.kind === 'video') {
            //         intervalId = setInterval(() => {
            //             if (this.stream.kind !== 'audio') {
            //                 if (this.$refs[this.stream.kind].videoWidth < 10) {
            //                     this.stream.visible = false
            //                 } else {
            //                     this.stream.visible = true
            //                     clearInterval(intervalId)
            //                 }
            //             }

            //         }, 250)
            //     }
            // }

            this.$refs[this.stream.kind].srcObject = app.media.streams[this.stream.id]
            this.stream.visible = true
        },
        props: ['stream'],
        render: templates.media_stream.r,
        staticRenderFns: templates.media_stream.s,
        watch: {
            'stream.id': function(streamId) {
                this.$refs[this.stream.kind].srcObject = app.media.streams[streamId]
            },
        },
    }

    return MediaStream
}
