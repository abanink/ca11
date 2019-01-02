module.exports = (app) => {
    app.components.MainMenu = Vue.component('MainMenu', require('./components/menu')(app))
    app.components.MainStatus = Vue.component('MainStatus', require('./components/status')(app))
    /**
    * @memberof fg.components
    */
    const Main = {
        computed: app.helpers.sharedComputed(),
        methods: Object.assign({
            classes: function(block) {
                let classes = {}

                if (block === 'component') {
                    classes[`theme-${this.ui.theme}`] = true
                } else if (block === 'notifications') {
                    if (this.user.authenticated) {
                        if (this.wizard.completed) {
                            classes.sidebar = true
                            classes.topbar = true
                        }
                    }
                } else if (block === 'panel') {
                    if (this.user.authenticated) classes.sidebar = true
                    if (this.overlay) classes['no-scroll'] = true
                }

                return classes
            },
        }, app.helpers.sharedMethods()),
        render: templates.main.r,
        staticRenderFns: templates.main.s,
        store: {
            calls: 'calls.calls',
            description: 'calls.description',
            layer: 'ui.layer',
            overlay: 'ui.overlay',
            telemetry: 'settings.telemetry',
            ui: 'ui',
            user: 'user',
            wizard: 'settings.wizard',
        },
    }

    return Main
}
