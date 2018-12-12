module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const MediaStrip = {
        computed: {
            // filteredStreams: function() {
            //     if (this.call) {
            //         console.log('REFS:',this.$refs)

            //         for (const [streamId, stream] of Object.entries(this.call.streams)) {
            //             console.log("WTF", this.$refs[`video-${streamId}`])
            //             if (this.$refs[`video-${streamId}`]) {
            //                 console.log("PLAY VIDEO", streamId)
            //                 this.$refs[`video-${streamId}`].srcObject = app.media.streams[streamId]
            //                 this.$refs[`video-${streamId}`].play()
            //             } else {

            //             }
            //             // app.media.streams[streamId].play()
            //             // stream.play()
            //         }
            //         console.log("FOOOO")
            //         return this.call.streams
            //     }
            //     return Object.values(this.streams)
            // },
        },
        methods: app.helpers.sharedMethods(),
        mounted: function() {
            // if (!app.media.streams.local) {
            //     app.on('local-stream-ready', () => {
            //         this.$refs['local-video'].srcObject = app.media.streams.local
            //         this.$refs['local-video'].play()
            //     })
            // } else {
            //     this.$refs['local-video'].srcObject = app.media.streams.local
            //     this.$refs['local-video'].play()
            // }
        },
        props: {
            call: {default: null},
        },
        render: templates.media_strip.r,
        staticRenderFns: templates.media_strip.s,
        store: {
            app: 'app',
            user: 'user',
        },
        // watch: {
        //     'call.tracks.video': function(videos) {
        //         for (const video of (Object.keys(videos))) {

        //         }
        //     },
        // },
    }

    return MediaStrip
}
