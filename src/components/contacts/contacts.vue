<component class="component-contacts padded">

    <header class="header-bar">
        <div class="filter-line">
            <div class="header-bar-title uc">{{$t('contacts')}}</div>
            <div class="content-filters">
                <div class="filter" :class="classes('filter-online')" @click="toggleFilterOnline()">
                    <icon name="online"/>
                    <span class="cf">{{$t('online')}}</span>
                </div>
                <div class="filter" :class="classes('filter-favorites')" @click="toggleFilterFavorites()">
                    <icon name="star"/>
                    <span class="cf">{{$t('favorites')}}</span>
                </div>
            </div>
        </div>
        <div class="action-line">
            <div class="field field-text search">
                <div class="control">
                    <input class="input" autofocus type="input"
                        :placeholder="$t('search').capitalize() + '...'"
                        :disabled="search.disabled"
                        v-model="search.input"/>
                </div>
            </div>

            <div class="action" @click.stop="changeDisplay()">
                <icon :name="`contacts-${displayMode}`"/>
            </div>

            <div class="action" :class="{active: editMode}" @click.stop="toggleEditMode()">
                <icon name="edit"/>
            </div>

            <div v-if="editMode" class="action" @click.stop="addContact()">
                <icon name="contact-add"/>
            </div>
        </div>
    </header>


    <div class="item-list" :class="classes('item-list')">
        <div class="no-results-indicator" v-if="!filteredContacts.length">
            <div><icon name="contacts"/></div>
            <div class="text cf">{{$t('no {target}', {target: $t('contacts')})}}</div>
        </div>

        <div v-else v-for="contact in filteredContacts" v-click-outside="toggleSelectContact"
            @click.stop="toggleSelectContact(contact, true)"
            class="item-container contact" :class="{selected: contact.selected}">

            <div class="item">
                <div class="item-header">
                    <icon class="item-icon" name="contact"/>
                </div>

                <div class="item-info">
                    <div class="item-handle">
                        <input class="item-tag" :readonly="!editMode" type="text" v-model="contact.name"/>

                        <div class="item-options">
                            <button v-if="!editMode" @click.stop="toggleFavorite(contact)" class="item-option" :class="classes('favorite-button', contact.favorite)">
                                <icon name="star" :class="contact.status"/>
                            </button>
                            <button v-if="editMode && contact.selected" @click.stop="addEndpoint(contact)" class="item-option">
                                <icon name="phone-add"/>
                            </button>
                            <button v-if="editMode" @click.stop="deleteContact(contact)" class="item-option">
                                <icon name="delete"/>
                            </button>
                            <!-- <button class="item-option green" v-show="transferStatus === 'select'" :disabled="!isTransferTarget(contact)" v-on:click.once="callContact(contact)">
                                <icon name="transfer"/>
                            </button> -->
                            <!-- <button class="item-option green" v-show="!transferStatus" :disabled="callingDisabled || !callsReady || !contactIsCallable(contact)" v-on:click="callContact(contact)">
                                <icon name="phone-circle" :class="contact.status"/>
                            </button> -->
                        </div>
                    </div>

                    <div v-if="Object.keys(contact.endpoints).length" class="item-description">
                        <div v-if="endpoint.protocol === 'sig11' || (endpoint.protocol === 'sip' && endpoint.subscribe)"
                            v-for="endpoint in contact.endpoints" class="presence-led"/>
                    </div>
                </div>
            </div>

            <div v-if="contact.selected" class="item-context">

                <div class="no-items" v-if="!Object.keys(contact.endpoints).length">
                    <span class="cf">{{$t('no endpoints')}}...</span>
                </div>

                <!-- Contains all collapsed endpoints -->
                <div v-else v-for="endpoint in contact.endpoints" class="context-item" :class="{writable: editMode}">

                    <span class="context-item-icon">
                        <icon v-if="editMode" :name="`protocol-${endpoint.protocol}`"
                            :class="endpoint.status"
                            @click.stop="toggleEndpointProtocol(contact, endpoint)"/>
                        <icon v-else :name="`protocol-${endpoint.protocol}`"
                            :class="endpoint.status"
                            @click.stop="callEndpoint(contact, endpoint)"/>
                    </span>

                    <input v-if="endpoint.protocol === 'sip'"
                        v-model="endpoint.number"
                        class="item-tag"
                        :readonly="!editMode"
                        :placeholder="$t('extension or phonenumber').capitalize()"
                        type="text"/>
                    <input v-else-if="endpoint.protocol === 'sig11'"
                        v-model="endpoint.pubkey"
                        class="item-tag"
                        :readonly="!editMode"
                        :placeholder="$t('public key').capitalize()"
                        type="text"/>

                    <div class="context-item-options">
                        <button v-if="editMode"
                            @click.stop="toggleSubscribe(contact, endpoint)"
                            class="item-option"
                            :class="{active: endpoint.subscribe}">
                            <icon name="eye"/>
                        </button>
                        <button v-if="editMode"
                            @click.stop="deleteEndpoint(contact, endpoint)"
                            class="item-option">
                            <icon name="delete"/>
                        </button>
                    </div>
                </div>


            </div>
        </div>
    </div>
</component>
