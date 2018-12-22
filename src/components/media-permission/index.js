module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const MediaPermission = {
        beforeDestroy: function() {
            clearInterval(this.intervalId)
        },
        computed: app.helpers.sharedComputed(),
        methods: Object.assign({}, app.helpers.sharedMethods()),
        props: {
            soundmeter: {default: true},
        },
        render: templates.media_permission.r,
        staticRenderFns: templates.media_permission.s,
        store: {
            app: 'app',
            devices: 'settings.webrtc.devices',
            env: 'env',
            permission: 'settings.webrtc.media.permission',
            settings: 'settings',
        },
    }

    return MediaPermission
}
