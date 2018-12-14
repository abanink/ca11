module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const MediaStrip = {
        methods: app.helpers.sharedMethods(),
        props: ['call'],
        render: templates.media_strip.r,
        staticRenderFns: templates.media_strip.s,
        store: {
            app: 'app',
            stream: 'settings.webrtc.media.stream',
            user: 'user',
        },
    }

    return MediaStrip
}
