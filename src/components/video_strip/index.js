module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const VideoStrip = {
        methods: app.helpers.sharedMethods(),
        mounted: function() {
            if (!app.localStream) {
                app.on('local-stream-ready', () => {
                    this.$refs['local-video'].src = window.URL.createObjectURL(app.localStream)
                    this.$refs['local-video'].play()
                })
            } else {
                this.$refs['local-video'].src = window.URL.createObjectURL(app.localStream)
                this.$refs['local-video'].play()
            }
        },
        props: {
            call: {default: null},
        },
        render: templates.video_strip.r,
        staticRenderFns: templates.video_strip.s,
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

    return VideoStrip
}
