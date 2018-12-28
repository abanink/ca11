<section component class="c-activities">

    <header class="main-content-header">
        <icon class="header-icon" name="recent"/>
        <div class="header-text uc">{{$t('activity')}}</div>

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

        <div class="header-filters">
            <button
                class="filter tooltip tooltip-bottom"
                :class="classes('filter-reminders')"
                :data-tooltip="$t('reminders').capitalize()"
                @click="toggleFilterReminders()"
            >
                <icon name="idea"/>
                <span class="cf">{{$t('reminders')}}</span>
            </button>
            <button
                class="filter tooltip tooltip-bottom"
                :class="classes('filter-missed-incoming')"
                :data-tooltip="$t('missed').capitalize()"
                @click="toggleFilterMissedIncoming()"
                >
                <icon name="call-missed-incoming"/>
                <span class="cf hide">{{$t('missed')}}</span>
            </button>
            <button
                class="filter tooltip tooltip-bottom"
                :class="classes('filter-missed-outgoing')"
                :data-tooltip="$t('unanswered').capitalize()"
                @click="toggleFilterMissedOutgoing()"
            >
                <icon name="call-missed-outgoing"/>
                <span class="cf">{{$t('unanswered')}}</span>
            </button>
        </div>

        <div class="header-actions">
            <button class="action" :class="{active: editMode}" @click.stop="toggleEditMode()">
                <icon name="edit"/>
            </button>

            <button v-if="editMode" class="action" @click.stop="deleteActivities()">
                <icon name="delete"/>
            </button>
        </div>

    </header>

    <main class="main-content-base">
        <article class="item-list">

            <div class="no-results-indicator" v-if="!filteredActivities.length">
                <div><icon name="recent"/></div>
                <div class="text cf">{{$t('no {target}', {target: $t('activity')})}}</div>
            </div>

            <div v-else v-for="activity of filteredActivities" class="item-container activity">
                <div class="item">
                    <div class="item-header" :class="classes('recent-status', activity)">
                        <icon class="item-icon" :name="activity.icon"/>
                    </div>

                    <div class="item-info">
                        <div class="item-handle">
                            <div class="item-tag" v-if="activity.contact">
                                {{activity.contact.name}}
                            </div>
                            <div class="item-tag" v-else>
                                {{activity.description.endpoint}}
                            </div>

                            <input v-if="activity.remind" class="activity-label" type="text" v-model="activity.label" :placeholder="$t(activity.status)" />

                            <div class="item-options">
                                <button v-if="!editMode" class="item-option" :class="classes('remind-button', activity)" v-on:click="toggleReminder(activity)">
                                    <icon name="idea"/>
                                </button>
                                <button v-if="!editMode" class="item-option" v-on:click="callEndpoint(activity)">
                                    <icon name="phone"/>
                                </button>
                                <button v-if="editMode" @click.stop="deleteActivity(activity)" class="item-option">
                                    <icon name="delete"/>
                                </button>
                            </div>
                        </div>

                        <div class="item-description">
                            {{activity.description.endpoint}} - {{activity.date | fuzzydate}}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    </main>
</section>
