module.exports = (app, shared) => {
    /**
    * @memberof fg.components
    */
    const WizardMediaPermission = {
        computed: Object.assign({
            stepValid: function() {
                return this.permission
            },
        }, app.helpers.sharedComputed()),
        methods: Object.assign({
            queryDevices: async function() {
                await app.devices.verifySinks()
                this.stepNext()
            },
        }, shared().methods),
        mounted: function() {
            app.media.poll()
        },
        render: templates.wizard_media_permission.r,
        staticRenderFns: templates.wizard_media_permission.s,
        store: {
            app: 'app',
            options: 'settings.wizard.steps.options',
            permission: 'settings.webrtc.media.permission',
            selected: 'settings.wizard.steps.selected',
        },
    }

    return WizardMediaPermission
}
