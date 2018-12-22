module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const CallStatus = {
        computed: app.helpers.sharedComputed(),
        methods: app.helpers.sharedMethods(),
        props: ['call'],
        render: templates.call_status.r,
        staticRenderFns: templates.call_status.s,
    }

    return CallStatus
}
