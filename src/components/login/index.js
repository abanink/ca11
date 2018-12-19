module.exports = (app) => {

    const v = Vuelidate.validators

    /**
    * @memberof fg.components
    */
    const Login = {
        computed: app.helpers.sharedComputed(),
        data: function() {
            return {
                password: '',
                validateApi: false,
            }
        },
        methods: Object.assign({
            login: function() {
                if (this.$v.$invalid) return

                if (this.app.session.active === 'new' || !this.app.session.available.length) {
                    app.emit('bg:user:login', {
                        password: this.password,
                        username: this.user.username,
                    })
                } else {
                    app.emit('bg:user:unlock', {
                        password: this.password,
                        username: this.app.session.active,
                    })
                }
            },
            newSession: function() {
                app.setState({app: {session: {active: 'new'}}, user: {username: ''}})
            },
            removeSession: function(session) {
                app.emit('bg:user:remove_session', {session})
            },
            selectSession: function(session = null) {
                this.password = ''
                app.emit('bg:user:set_session', {session})
            },
        }, app.helpers.sharedMethods()),
        render: templates.login.r,
        staticRenderFns: templates.login.s,
        store: {
            account: 'settings.sip.account',
            app: 'app',
            availability: 'availability',
            calls: 'calls',
            settings: 'settings',
            url: 'settings.platform.url',
            user: 'user',
            vendor: 'app.vendor',
        },
        updated: function() {
            // Validation needs to be reset after an update, so
            // the initial validation is only done after a user
            // action.
            this.$v.$reset()
        },
        validations: function() {
            // Bind the API response message to the validator $params.
            let validations = {
                password: {
                    minLength: v.minLength(6),
                    required: v.required,
                },
                user: {
                    username: {
                        requiredIf: v.requiredIf(() => {
                            return !this.app.session.active
                        }),
                    },
                },
            }

            return validations
        },
        watch: {
            'user.username': function(username) {
                app.setState({user: {username}})
            },
        },
    }


    return Login
}
