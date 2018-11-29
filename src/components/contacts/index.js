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
                    favorite: false,
                    id: shortid(),
                    name: 'unnamed',
                    selected: true,
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
                    type: 'sip',
                }

                app.setState(endpoint, {
                    action: 'upsert',
                    path: `contacts.contacts.${contact.id}.endpoints.${endpoint.id}`,
                    persist: true,
                })
            },
            /**
            * Call the Contact on its first available endpoint.
            * @param {Contact} contact - The contact to call.
            */
            callContact: function(contact) {
                for (const id of Object.keys(contact.endpoints)) {
                    if (contact.endpoints[id].status === 'available') {
                        this.createCall(contact.endpoints[id].number)
                        break
                    }
                }
            },
            changeDisplay: function() {
                this.displayMode = this.displayMode % 3 + 1
                app.setState({contacts: {displayMode: this.displayMode}}, {persist: true})
            },
            classes: function(block, modifier = null) {
                let classes = {}
                if (block === 'item-list') {
                    classes[`x-${this.displayMode}`] = true
                } else if (block === 'favorite-button') {
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
             * Only one contact at a time can be in
             * a selected state.
             * @param {Object} contact The Contact's state.
             */
            toggleSelectContact: function(contact) {
                for (const _contact of Object.values(this.contacts)) {
                    if (contact.id !== _contact.id) _contact.selected = false
                }
                contact.selected = !contact.selected
                app.setState({contacts: {contacts: this.contacts}}, {persist: true})
            },
        }, app.helpers.sharedMethods()),
        render: templates.contacts.r,
        staticRenderFns: templates.contacts.s,
        store: {
            calls: 'calls.calls',
            contacts: 'contacts.contacts',
            displayMode: 'contacts.displayMode',
            editMode: 'app.editMode',
            filters: 'contacts.filters',
            search: 'contacts.search',
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
