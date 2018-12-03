<component class="component-activity padded">

    <header class="header-bar">
        <div class="filter-line">
            <div class="header-bar-title uc">{{$t('activity')}}</div>
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

            <div v-if="editMode" class="action" @click.stop="deleteActivities()">
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
                        <div class="item-tag" v-if="activity.contact">
                            {{activity.contact.name}}
                          </div>
                        <div class="item-tag" v-else>
                            {{activity.endpoint}}
                        </div>

                        <input v-if="activity.remind" class="activity-label" type="text" v-model="activity.label" :placeholder="$t(activity.status)" />

                        <div class="item-options">
                            <button v-if="!editMode" class="item-option" :class="classes('remind-button', activity)" v-on:click="toggleReminder(activity)">
                                <icon name="idea"/>
                            </button>
                            <button v-if="!editMode" class="item-option" v-on:click="callRecent(activity)">
                                <icon name="phone"/>
                            </button>
                            <button v-if="editMode" @click.stop="deleteActivity(activity)" class="item-option">
                                <icon name="delete"/>
                            </button>
                        </div>
                    </div>

                    <div class="item-description">
                        <template v-if="activity.contact && activity.contact.endpoints[activity.endpoint]">
                            {{activity.endpoints[activity.endpoint].number}}
                        </template>
                        <template v-else>
                            <!-- Reference may be broken -->
                            {{activity.endpoint}}
                        </template>

                        - {{activity.date | fuzzydate}}


                    </div>
                </div>
            </div>
        </div>
    </div>
</component>
