<component class="component-contacts padded">

    <header>
        <div class="header-line">
            <div class="title uc">{{$t('contacts')}}</div>
            <div class="vertical-devider"></div>
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
        <div class="header-line action-bar">
            <div class="field field-text">
                <div class="control">
                    <input class="input" autofocus type="input"
                        :placeholder="$t('search').capitalize() + '...'"
                        :disabled="search.disabled"
                        v-model="search.input"/>
                </div>
            </div>

            <div class="action" @click="changeDisplay()">
                <icon :name="`contacts-${displayMode}`"/>
            </div>

            <div class="action" :class="{active: editMode}" @click="toggleEditMode()">
                <icon name="edit"/>
            </div>

            <div v-if="editMode" class="action" @click="addContact()">
                <icon name="contact-add"/>
            </div>
        </div>
    </header>


    <div class="item-list" :class="classes('item-list')">

        <div class="loading-indicator" v-if="status === 'loading'">
            <div><icon class="spinner" name="spinner"/></div>
            <div class="text cf">{{$t('loading')}}<span>.</span><span>.</span><span>.</span></div>
        </div>

        <div class="no-results-indicator" v-else-if="!Object.keys(filteredContacts).length">
            <div><icon name="contacts"/></div>
            <div class="text cf">{{$t('no {target}', {target: $t('contacts')})}}</div>
        </div>

        <div v-click-outside="toggleSelectContact" @click.stop="toggleSelectContact(contact, true)" v-else v-for="contact in filteredContacts" class="contact" :class="{selected: contact.selected}">

            <div class="item" >
                <div class="avatar-state">
                    <icon class="placeholder" name="contact" v-if="displayMode < 3"/>
                </div>

                <div class="item-info">
                    <input class="name" :readonly="!editMode" type="text" v-model="contact.name"/>
                </div>

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

            <div v-if="contact.selected" class="item-context">

                <div class="no-items" v-if="!Object.keys(contact.endpoints).length">
                    <span class="cf">{{$t('no endpoints')}}...</span>
                </div>

                <!-- Contains all endpoints -->
                <div v-else v-for="endpoint in contact.endpoints" class="context-item">

                    <span class="context-item-icon editable"
                        :class="{writable: editMode}"
                        @click.stop="toggleEndpointProtocol(contact, endpoint)">
                        <icon :name="`protocol-${endpoint.protocol}`" :class="endpoint.status"/>
                    </span>

                    <input v-if="endpoint.protocol === 'sip'"
                        v-model="endpoint.number"
                        class="name"
                        :readonly="!editMode"
                        :placeholder="$t('extension or phonenumber').capitalize()"
                        type="text"/>
                    <input v-else-if="endpoint.protocol === 'sig11'"
                        v-model="endpoint.pubkey"
                        class="name"
                        :readonly="!editMode"
                        :placeholder="$t('public key').capitalize()"
                        type="text"/>

                    <div class="context-item-options">
                        <button v-if="editMode && endpoint.protocol === 'sip'"
                            @click.stop="toggleSubscribe(contact, endpoint)"
                            class="item-option">
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
