<component class="component-activity padded">

    <header>
        <div class="header-line filter-bar">
            <div class="title uc">{{$t('activity')}}</div>
            <div class="vertical-devider"></div>
            <div class="content-filters">
                <div class="filter" :class="classes('filter-missed-incoming')" @click="toggleFilterMissedIncoming()">
                    <icon name="call-missed-incoming"/>
                    <span class="cf">{{$t('missed')}}</span>
                </div>
                <div class="filter" :class="classes('filter-missed-outgoing')" @click="toggleFilterMissedOutgoing()">
                    <icon name="call-missed-outgoing"/>
                    <span class="cf">{{$t('unanswered')}}</span>
                </div>
                <div class="filter" :class="classes('filter-reminders')" @click="toggleFilterReminders()">
                    <icon name="idea"/>
                    <span class="cf">{{$t('reminders')}}</span>
                </div>
            </div>
        </div>
        <div class="header-line action-bar">
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
                <icon name="delete"/>
            </div>
        </div>
    </header>

    <div class="item-list" :class="classes('item-list')">
        <div class="no-results-indicator" v-if="!filteredActivity.length">
            <div><icon name="recent"/></div>
            <div class="text cf">{{$t('no {target}', {target: $t('activity')})}}</div>
        </div>

        <div v-else v-for="activity of filteredActivity" class="item-container activity" >
            <div class="item">

                <div class="item-header" :class="classes('recent-status', activity)">
                    <icon class="item-icon" :name="activity.type"/>
                </div>

                <div class="item-info">
                    <div class="item-handle">
                        <div class="name" v-if="activity.contact">
                            {{contacts[activity.contact].name}}
                            <span v-if="contacts[activity.contact].endpoints[activity.endpoint]">
                                - {{contacts[activity.contact].endpoints[activity.endpoint].number}}
                            </span>
                            <span v-else>
                                <!-- Reference may be broken -->
                                {{activity.endpoint}}
                            </span>
                        </div>
                        <div class="name" v-else>{{activity.endpoint}}</div>

                        <div class="item-options">
                            <button class="item-option" :class="classes('remind-button', activity)" v-on:click="toggleReminder(activity)">
                                <icon name="idea"/>
                            </button>
                            <button class="item-option" v-on:click="callRecent(activity)">
                                <icon name="phone"/>
                            </button>
                        </div>
                    </div>

                    <div class="item-description">
                        {{activity.date | fuzzydate}}
                    </div>
                </div>



                <input class="activity-label" v-if="activity.remind" type="text" v-model="activity.label" :placeholder="$t(activity.status)" />



            </div>
        </div>
    </div>
</component>
