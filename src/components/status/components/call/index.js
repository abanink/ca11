module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const Call = {
        computed: app.helpers.sharedComputed(),
        methods: app.helpers.sharedMethods(),
        props: ['call'],
        render: templates.status_call.r,
        staticRenderFns: templates.status_call.s,
    }

    return Call
}
