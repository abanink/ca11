module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const MainCallbar = {
        computed: app.helpers.sharedComputed(),
        methods: app.helpers.sharedMethods(),
        props: ['call'],
        render: templates.main_callbar.r,
        staticRenderFns: templates.main_callbar.s,
    }

    return MainCallbar
}
