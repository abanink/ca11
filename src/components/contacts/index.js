module.exports = (app) => {
    const PRESENCE_STATUS = ['available', 'busy']

    /**
    * @memberof fg.components
    */
    const Contact = {
        computed: Object.assign({
            filteredContacts: function() {
                let contacts = Object.entries(this.contacts).map((i) => i[1])

                if (this.filters.favorites) contacts = contacts.filter((i) => i.favorite)
                if (this.filters.presence) {
                    contacts = contacts.filter((i) => {
                        for (const entrypoint of Object.values(i.endpoints)) {
                            if (PRESENCE_STATUS.includes(entrypoint.status)) {
                                return true
                            }
                        }
                        return false
                    })
                }

                let searchQuery = this.search.input.toLowerCase()
                if (searchQuery) {
                    contacts = contacts.filter((i) => {
                        let match = false
                        // Search on contact name and on contact endpoint.
                        match = i.name.toLowerCase().includes(searchQuery)

                        for (const endpoint of Object.values(i.endpoints)) {
                            if (endpoint.number.includes(searchQuery)) {
                                match = true
                                break
                            }
                        }

                        return match
                    })
                }

                return contacts
            },
        }, app.helpers.sharedComputed()),
        data: function() {
            return {
                subscribeAll: false,
            }
        },
        methods: Object.assign({
            addContact: function() {
                // Make sure all filter are off when adding a new Contact.
                app.setState({contacts: {filters: {favorites: false, presence: false}}}, {persist: true})

                let newContact = {
                    endpoints: {},
                    favorite: false,
                    id: shortid(),
                    name: 'unnamed',
                    selected: false,
                }

                app.setState(newContact, {
                    action: 'upsert',
                    path: `contacts.contacts.${newContact.id}`,
                    persist: true,
                })
            },
            addEndpoint: function(contact) {
                let endpoint = {
                    id: shortid(),
                    number: '',
                    protocol: 'sip',
                    pubkey: '',
                    status: 'unavailable',
                    subscribe: false,
                }

                app.setState(endpoint, {
                    action: 'upsert',
                    path: `contacts.contacts.${contact.id}.endpoints.${endpoint.id}`,
                    persist: true,
                })
            },
            callEndpoint: function(contact, endpoint) {
                // Make a description.
                this.setupCall({
                    endpoint: endpoint.protocol === 'sip' ? endpoint.number : endpoint.pubkey,
                    protocol: endpoint.protocol,
                    status: 'new',
                })
            },
            classes: function(block, modifier = null) {
                let classes = {}
                if (block === 'favorite-button') {
                    classes.active = modifier
                } else if (block === 'filter-favorites') {
                    classes.active = this.filters.favorites
                } else if (block === 'filter-presence') {
                    classes.active = this.filters.presence
                }
                return classes
            },
            contactIsCallable: function(contact) {
                let isReady = false
                for (const id of Object.keys(contact.endpoints)) {
                    if (contact.endpoints[id].status === 'available') {
                        isReady = true
                    }
                }

                return isReady
            },
            deleteContact: function(contact) {
                app.setState(null, {
                    action: 'delete',
                    path: `contacts.contacts.${contact.id}`,
                    persist: true,
                })
            },
            deleteEndpoint: function(contact, endpoint) {
                app.setState(null, {
                    action: 'delete',
                    path: `contacts.contacts.${contact.id}.endpoints.${endpoint.id}`,
                    persist: true,
                })
            },
            endpointActive: function(endpoint) {
                if (endpoint.number && endpoint.protocol === 'sip') return true
                else if (endpoint.pubkey && endpoint.protocol === 'sig11') return true
                return false
            },
            toggleEndpointProtocol: function(contact, endpoint) {
                if (!this.editMode) return

                if (endpoint.protocol === 'sip') endpoint.protocol = 'sig11'
                else endpoint.protocol = 'sip'
                app.setState(endpoint, {
                    action: 'upsert',
                    path: `contacts.contacts.${contact.id}.endpoints.${endpoint.id}`,
                    persist: true,
                })
            },
            toggleFavorite: function(contact) {
                app.setState({favorite: !contact.favorite}, {path: `contacts.contacts.${contact.id}`, persist: true})
            },
            toggleFilterFavorites: function() {
                app.setState({contacts: {filters: {favorites: !this.filters.favorites}}}, {persist: true})
            },
            toggleFilterPresence: function() {
                app.setState({contacts: {filters: {presence: !this.filters.presence}}}, {persist: true})
            },
            /**
             * One contact at a time is in a selected state.
             * Contact is not passed with v-click-outside
             * and doesn't need to be.
             * @param {Object} contact The Contact's state.
             * @param {Boolean} select Selects or deselects Contact.
             */
            toggleSelectContact: function(contact, select = true) {
                for (const _contact of Object.values(this.contacts)) {
                    if (contact.id !== _contact.id) _contact.selected = false
                }

                if (select) contact.selected = select
                app.setState({contacts: {contacts: this.contacts}}, {persist: true})
            },
            toggleSubscribe: function(contact, endpoint) {
                if (!endpoint.subscribe) {
                    app.emit('bg:contacts:subscribe', {contact, endpoint})
                } else {
                    app.emit('bg:contacts:unsubscribe', {contact, endpoint})
                }
            },
            toggleSubscribeAll: function() {
                this.subscribeAll = !this.subscribeAll

                if (this.subscribeAll) app.emit('bg:contacts:subscribe-all')
                else app.emit('bg:contacts:unsubscribe-all')
            },
        }, app.helpers.sharedMethods()),
        render: templates.contacts.r,
        staticRenderFns: templates.contacts.s,
        store: {
            calls: 'calls.calls',
            contacts: 'contacts.contacts',
            editMode: 'app.editMode',
            filters: 'contacts.filters',
            search: 'app.search',
            status: 'contacts.status',
            user: 'user',
        },
        watch: {
            contacts: {
                deep: true,
                handler: function(contacts) {
                    app.setState({contacts: {contacts}}, {persist: true})
                },
            },
        },
    }

    return Contact
}
