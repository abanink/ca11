<section component class="c-main" :class="classes('component')">
    <!-- Force the telemetry window to show up -->
    <Notifications :class="classes('notifications')"/>

        <CallStatus
            v-if="(user.authenticated && wizard.completed) && (callOngoing && callActive)"
            class="c-main__status"
            :call="callActive"
        />
        <MainStatus v-else-if="(user.authenticated && wizard.completed)" class="c-main__status"/>

    <Login v-if="!user.authenticated"/>
    <Wizard v-else-if="!wizard.completed && user.authenticated"/>

    <MainMenu v-if="wizard.completed && user.authenticated" class="c-main__menu"/>
    <!-- Dynamic component from layer name -->
    <main component v-if="wizard.completed && user.authenticated" :is="layer" class="c-main__content"/>
    <MediaControls v-if="wizard.completed && user.authenticated && !['settings', 'about'].includes(layer)" :call="callActive"/>
</section>
