<component class="component-activity padded">

    <header>
        <div class="header-line">
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
    </header>

    <div class="item-list">
        <div class="no-results-indicator" v-if="!filteredActivity.length">
            <div><icon name="recent"/></div>
            <div class="text cf">{{$t('no {target}', {target: $t('activity')})}}</div>
        </div>

        <div v-else class="activity item" v-for="activity of filteredActivity">
            <div class="activity-icon" :class="classes('recent-status', activity)">
                <icon :name="activity.type"/>
            </div>
            <div class="item-info">
                <div class="name" v-if="activity.contact">
                    {{contacts[activity.contact].name}}
                </div>
                <div class="name" v-else>{{activity.endpoint}}</div>
                <div class="description">{{activity.date | fuzzydate}}</div>
            </div>

            <input class="activity-label" v-if="activity.remind" type="text" v-model="activity.label" :placeholder="$t(activity.status)" />


            <div class="item-options">
                <button class="item-option" :class="classes('remind-button', activity)" v-on:click="toggleReminder(activity)">
                    <icon name="idea"/>
                </button>
                <button class="item-option" v-on:click="callRecent(activity)">
                    <icon name="phone"/>
                </button>
            </div>
        </div>
    </div>
</component>
