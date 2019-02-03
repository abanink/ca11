module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const MediaControls = {
        methods: {
            /**
             * Always go the calls layer when clicked.
             */
            toggleSelect: function() {
                let selected = this.stream[this.stream.type].selected
                if (!selected) selected = new Date().getTime()
                else selected = null
                app.setState({
                    settings: {webrtc: {media: {stream: {[this.stream.type]: {selected}}}}},
                    ui: {layer: 'caller'},
                }, {persist: true})
            },
        },
        props: ['call'],
        render: templates.media_controls.r,
        staticRenderFns: templates.media_controls.s,
        store: {
            stream: 'settings.webrtc.media.stream',
        },
    }

    return MediaControls
}
