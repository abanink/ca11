module.exports = (app) => {

    const Sidebar = {
        methods: {
            isSection: function(section) {
                const route = this.$router.currentRoute.name
                // Opens users section by default.
                if (route === 'welcome' && section === 'users') return true
                else return route === section
            },
        },
        render: templates.sidebar.r,
        staticRenderFns: templates.sidebar.s,
        store: {
            topics: 'pages.topics',
            vendor: 'vendor',
            version: 'version',
        },
    }

    return Sidebar
}
