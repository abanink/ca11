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

        <div v-else v-for="contact in filteredContacts" class="contact" :class="{selected: contact.selected}">

            <div class="item" @click="toggleSelectContact(contact)">
                <div class="avatar-state">
                    <icon class="placeholder" name="contact" v-if="displayMode < 3"/>
                    <!-- Show the available endpoints -->
                    <div class="endpoint-container" v-for="endpoint in contact.endpoints">
                        <icon class="endpoint-status-icon" name="availability" v-if="displayMode === 'lean'" :class="endpoint.status"/>
                        <div class="endpoint-status-led" v-else :class="endpoint.status"/>
                    </div>
                </div>

                <div class="item-info">
                    <input class="name" :readonly="!editMode" type="text" v-model="contact.name"/>
                    <div class="description">
                        <div v-for="endpoint in contact.endpoints">
                            {{endpoint.number}}
                        </div>
                    </div>
                </div>

                <div class="item-options">
                    <button @click="toggleFavorite(contact)" class="item-option" :class="classes('favorite-button', contact.favorite)">
                        <icon name="star" :class="contact.status"/>
                    </button>
                    <button v-if="editMode" @click="deleteContact(contact)" class="item-option">
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
                <div v-if="editMode" class="context-options">
                    <button @click="addEndpoint(contact)" class="item-option">
                        <icon name="phone-add"/>
                    </button>
                </div>

                <div class="no-items" v-if="!Object.keys(contact.endpoints).length">
                    <span class="cf">{{$t('no endpoints')}}...</span>
                </div>

                <div class="endpoint-container" v-for="endpoint in contact.endpoints">
                    <icon class="endpoint-status-icon" name="availability" :class="endpoint.status"/>
                </div>
            </div>
        </div>
    </div>
</component>
