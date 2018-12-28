module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    let types
    // Android crashes at the moment on getDisplayMedia.
    if (app.env.isAndroid) types = ['audio', 'video']
    else types = ['audio', 'video', 'display']

    const MediaControls = {
        methods: Object.assign({
            switchStream: function() {
                // Step through streamTypes.
                const nextStreamType = types[(types.indexOf(this.stream.type) + 1) % types.length]
                app.media.query(nextStreamType)
            },
        }, app.helpers.sharedMethods()),
        props: ['call'],
        render: templates.media_controls.r,
        staticRenderFns: templates.media_controls.s,
        store: {
            app: 'app',
            stream: 'settings.webrtc.media.stream',
            user: 'user',
        },
    }

    return MediaControls
}
