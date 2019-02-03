module.exports = (app) => {

    const v = Vuelidate.validators


    /**
    * @memberof fg.components
    */
    const Session = {
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
                    app.emit('session:start', {
                        password: this.password,
                        username: this.session.username,
                    })
                } else {
                    app.emit('session:unlock', {
                        password: this.password,
                        username: this.app.session.active,
                    })
                }
            },
            newSession: function() {
                app.setState({app: {session: {active: 'new'}}, session: {username: ''}})
            },
            removeSession: function(session) {
                app.emit('session:destroy', {session})
            },
            selectSession: function(session = null) {
                this.password = ''
                app.emit('session:select', {session})
            },
        }, app.helpers.sharedMethods()),
        render: templates.session.r,
        staticRenderFns: templates.session.s,
        store: {
            app: 'app',
            session: 'session',
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
                session: {
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
            'session.username': function(username) {
                app.setState({session: {username}})
            },
        },
    }


    return Session
}
