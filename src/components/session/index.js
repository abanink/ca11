module.exports = (app) => {

    const v = Vuelidate.validators

    let sloganInterval

    /**
    * @memberof fg.components
    */
    const Session = {
        computed: {
            slogan: function() {
                return this.slogans[this.currentSlogan]
            },
        },
        data: function() {
            return {
                currentSlogan: 0,
                password: '',
                slogans: [
                    {id: 0, phrase: this.$t('free web telephony'), show: true},
                    {id: 1, phrase: this.$t('secure communication'), show: false},
                    {id: 2, phrase: this.$t('no accounts'), show: false},
                    {id: 3, phrase: this.$t('your own phonenumber'), show: false},
                    {id: 4, phrase: this.$t('video conferencing'), show: false},
                    {id: 5, phrase: this.$t('screen sharing'), show: false},
                ],
                validateApi: false,
            }
        },
        destroyed: function() {
            clearInterval(sloganInterval)
        },
        methods: Object.assign({
            login: function() {
                if (this.$v.$invalid) return

                if (this.app.session.active === 'new' || !this.app.session.available.length) {
                    app.session.start({
                        password: this.password,
                        username: this.session.username,
                    })
                } else {
                    app.session.unlock({
                        password: this.password,
                        username: this.app.session.active,
                    })
                }
            },
            newSession: function() {
                app.setState({app: {session: {active: 'new'}}, session: {username: ''}})
            },
            removeSession: function(sessionId) {
                app.session.destroy(sessionId)
            },
            selectSession: function(session = null) {
                this.password = ''
                app.session.change(session)
            },
        }, app.helpers.sharedMethods()),
        mounted: function() {
            sloganInterval = setInterval(() => {
                this.slogans.forEach((s) => {s.show = false})
                this.currentSlogan = (this.currentSlogan + 1) % this.slogans.length
                this.slogans[this.currentSlogan].show = true
            }, 3000)
        },
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
