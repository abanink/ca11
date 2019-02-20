module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const DevicesPermission = {
        beforeDestroy: function() {
            clearInterval(this.intervalId)
        },
        computed: app.helpers.sharedComputed(),
        methods: Object.assign({}, app.helpers.sharedMethods()),
        props: {
            soundmeter: {default: true},
        },
        render: templates.devices_permission.r,
        staticRenderFns: templates.devices_permission.s,
        store: {
            app: 'app',
            devices: 'settings.webrtc.devices',
            env: 'env',
            media: 'settings.webrtc.media',
            settings: 'settings',
        },
    }

    return DevicesPermission
}
