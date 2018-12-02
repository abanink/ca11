module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const Contact = {
        computed: Object.assign({
            filteredContacts: function() {
                let searchQuery = this.search.input.toLowerCase()
                let contacts = []
                // let _registeredContacts = []
                // let _unregisteredContacts = []

                for (const contactId of Object.keys(this.contacts)) {
                    const contact = this.contacts[contactId]
                    // Filter favorites only.
                    if (this.filters.favorites && !contact.favorite) continue
                    if (this.filters.online) {
                        if (!this.contactIsRegistered(contact)) continue
                    }

                    const name = contact.name.toLowerCase()
                    if (name.includes(searchQuery)) {
                        // First try to match on the name.
                        contacts.push(contact)
                        // if (this.contactIsRegistered(contact)) _registeredContacts.push(contact)
                        // else _unregisteredContacts.push(contact)
                    } else {
                        // Try to match on the endpoint's number.
                        for (const endpointId of Object.keys(contact.endpoints)) {
                            if (String(contact.endpoints[endpointId].number).includes(searchQuery)) {
                                contacts.push(contact)
                                // if (this.contactIsRegistered(contact)) _registeredContacts.push(contact)
                                // else _unregisteredContacts.push(contact)
                                break
                            }
                        }
                    }
                }

                // First show the registered accounts; then the unregistered ones.
                // _registeredContacts = _registeredContacts.sort(app.utils.sortByMultipleKey(['name']))
                // _unregisteredContacts = _unregisteredContacts.sort(app.utils.sortByMultipleKey(['name']))
                return contacts
            },
        }, app.helpers.sharedComputed()),
        methods: Object.assign({
            addContact: function() {
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
                    name: 'unnamed',
                    number: '',
                    protocol: 'sip',
                    pubkey: '',
                    subscribe: false,
                    target: '',
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
                if (block === 'item-list') classes[`x-${this.displayMode}`] = true
                else if (block === 'favorite-button') {
                    classes.active = modifier
                } else if (block === 'filter-favorites') {
                    classes.active = this.filters.favorites
                } else if (block === 'filter-online') {
                    classes.active = this.filters.online
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
            contactIsRegistered: function(contact) {
                let isRegistered = false
                for (const id of Object.keys(contact.endpoints)) {
                    if (contact.endpoints[id].status !== 'unregistered') {
                        isRegistered = true
                    }
                }

                return isRegistered
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
            toggleFilterOnline: function() {
                app.setState({contacts: {filters: {online: !this.filters.online}}}, {persist: true})
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
                endpoint.subscribe = !endpoint.subscribe
                app.setState({contacts: {contacts: this.contacts}}, {persist: true})
            },
        }, app.helpers.sharedMethods()),
        render: templates.contacts.r,
        staticRenderFns: templates.contacts.s,
        store: {
            calls: 'calls.calls',
            contacts: 'contacts.contacts',
            displayMode: 'app.displayMode',
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
