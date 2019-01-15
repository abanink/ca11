module.exports = (app) => {

    const Welcome = {
        render: templates.welcome.r,
        staticRenderFns: templates.welcome.s,
    }

    return Welcome
}
