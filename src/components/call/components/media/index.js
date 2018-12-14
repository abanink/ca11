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
        props: ['call'],
        render: templates.call_media.r,
        staticRenderFns: templates.call_media.s,
        store: {
            stream: 'settings.webrtc.media.stream',
        },
    }

    return Media
}
