module.exports = (app, shared) => {
    /**
    * @memberof fg.components
    */
    const ProtocolHandler = {
        computed: app.helpers.sharedComputed(),
        methods: Object.assign({
            triggerProtocolHandler: function() {
                if (navigator.unregisterProtocolHandler) navigator.unregisterProtocolHandler('tel', `${document.location.origin}/?%s`, 'CA11')
                navigator.registerProtocolHandler('tel', `${document.location.origin}/?%s`, 'CA11')
                this.stepNext()
            },
        }, shared().methods),
        render: templates.wizard_protocol_handler.r,
        staticRenderFns: templates.wizard_protocol_handler.s,
        store: {
            app: 'app',
            options: 'settings.wizard.steps.options',
            selected: 'settings.wizard.steps.selected',
        },
    }

    return ProtocolHandler
}
