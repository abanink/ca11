module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const MainMenu = {
        computed: app.helpers.sharedComputed(),
        data: function() {
            return {
                customPlugins: app.plugins,
            }
        },
        methods: Object.assign({
            classes: function(block) {
                let classes = {}
                // We assume here that a block is always an option. Change
                // this logic if other kind of blocks are required.
                classes.active = (this.layer === block)

                if (block === 'activities') {
                    classes.unread = this.activities.unread
                } else if (block === 'caller') {
                    classes.disabled = !this.app.online
                }

                return classes
            },
            logout: app.helpers.logout,
        }, app.helpers.sharedMethods()),
        render: templates.menu.r,
        staticRenderFns: templates.menu.s,
        store: {
            activities: 'activities',
            app: 'app',
            layer: 'ui.layer',
        },
    }

    return MainMenu
}
