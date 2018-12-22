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
            classes: function(block, transferHint) {
                let classes = {}
                // We assume here that a block is always an option. Change
                // this logic if other kind of blocks are required.
                classes.active = (this.layer === block)

                if (block === 'activities') {
                    classes.unread = this.activities.unread
                } else if (block === 'availability') {
                    if (this.dnd) classes.dnd = true
                    else if (this.available) classes.available = true
                    else classes.unavailable = true
                } else if (block === 'calls') {
                    classes.disabled = !this.app.online
                } else if (transferHint) {
                    classes.hint = (this.transferStatus === 'select')
                }

                return classes
            },
            logout: app.helpers.logout,
        }, app.helpers.sharedMethods()),
        render: templates.main_menu.r,
        staticRenderFns: templates.main_menu.s,
        store: {
            activities: 'activities',
            app: 'app',
            available: 'availability.available',
            dnd: 'availability.dnd',
            layer: 'ui.layer',
        },
    }

    return MainMenu
}
