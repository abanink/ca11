module.exports = (app, actions) => {
    /**
    * @memberof fg.components
    */
    const Availability = {
        computed: app.helpers.sharedComputed(),
        methods: app.helpers.sharedMethods(),
        render: templates.availability.r,
        staticRenderFns: templates.availability.s,
        store: {
            dnd: 'availability.dnd',
            webrtc: 'settings.webrtc',
        },
        watch: {
            dnd: function(dnd) {
                app.setState({availability: {dnd}}, {persist: true})
            },
        },
    }

    return Availability
}
