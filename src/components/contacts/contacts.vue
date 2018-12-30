<section component class="c-contacts content">

    <header class="content__header header">
        <icon class="header__icon" name="contacts"/>
        <div class="header__text">{{$t('contacts')}}</div>

        <div class="header__filters">
            <button
                class="header__filter tooltip tooltip-bottom"
                :class="classes('filter-favorites')"
                :data-tooltip="$t('favorites').capitalize()"
                @click="toggleFilterFavorites()"
            >
                <icon name="star"/>
            </button>
            <button
                class="header__filter tooltip tooltip-bottom"
                :class="classes('filter-presence')"
                :data-tooltip="$t('presence').capitalize()"
                @click="toggleFilterPresence()"
            >
                <icon name="presence"/>
            </button>
        </div>

        <div class="header__actions">
            <button
                class="header__action"
                :class="{'header__action--active': editMode}"
                @click.stop="toggleEditMode()"
            >
                <icon name="edit"/>
            </button>

            <button
                v-if="editMode"
                class="header__action"
                @click.stop="addContact()"
            >
                <icon name="contact-add"/>
            </button>

            <button
                v-if="editMode"
                class="header__action"
                :class="{active: subscribeAll}"
                @click.stop="toggleSubscribeAll()"
            >
                <icon name="eye"/>
            </button>
        </div>

        <!-- <div class="actions"> -->
            <!-- <div class="field field-text search">
                <div class="control">
                    <input class="input" autofocus type="input"
                        :placeholder="$t('search').capitalize() + '...'"
                        :disabled="search.disabled"
                        v-model="search.input"/>
                </div>
            </div> -->
        <!-- </div> -->
    </header>

    <main class="main">
        <article class="item-list">
            <div class="no-results-indicator" v-if="!filteredContacts.length">
                <div><icon name="contacts"/></div>
                <div class="text cf">{{$t('no {target}', {target: $t('contacts')})}}</div>
            </div>

            <div
                v-else
                v-for="contact in filteredContacts"
                v-click-outside="toggleSelectItem"
                @click.stop="toggleSelectItem(contact, true)"
                class="item-container contact"
                :class="{selected: contact.selected}"
            >

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
                                <!-- <button class="item-option green"
                                    v-show="!transferStatus"
                                    :disabled="callingDisabled || !callsReady || !contactIsCallable(contact)"
                                    @click.stop="callContact(contact)">
                                    <icon name="phone" :class="contact.status"/>
                                </button> -->
                            </div>
                        </div>

                        <div v-if="Object.keys(contact.endpoints).length" class="item-description">
                            <div v-if="editMode || endpointActive(endpoint)" v-for="endpoint in contact.endpoints" class="presence-led" :class="endpoint.status"/>
                        </div>
                    </div>
                </div>

                <div v-if="contact.selected" class="item-context">
                    <div class="no-items" v-if="!Object.keys(contact.endpoints).length">
                        <span class="cf">{{$t('no endpoints')}}...</span>
                    </div>

                    <!-- Contains all collapsed endpoints -->
                    <div v-if="editMode || endpointActive(endpoint)" v-for="endpoint in contact.endpoints" class="context-item" :class="{writable: editMode}">

                        <button v-if="editMode" class="context-item-icon" :class="endpoint.status"
                            @click.stop="toggleEndpointProtocol(contact, endpoint)">
                            <icon :name="`protocol-${endpoint.protocol}`"/>
                        </button>
                        <button v-else class="context-item-icon" :class="endpoint.status"
                            :disabled="!endpoint.number" @click.stop="callEndpoint(contact, endpoint)">
                            <icon :name="`protocol-${endpoint.protocol}`"/>
                        </button>


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
                                :class="{active: endpoint.subscribe}"
                                :disabled="!endpoint.number">
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
        </article>
    </main>
</section>
