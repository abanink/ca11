<section component class="c-main">
    <!-- Force the telemetry window to show up -->
    <Notifications :class="classes('notifications')"/>

    <div class="main-overlay" v-if="overlay">
        <div class="close-button" @click="closeOverlay()">
            <icon name="close"/>
        </div>
        <component v-bind:is="overlay"/>
    </div>

    <transition name="main-status" v-if="wizard.completed && user.authenticated">
        <CallStatus
            v-if="callOngoing && callActive"
            class="main-status"
            :call="callActive"
        />
        <MainStatus v-else class="main-status"/>
    </transition>

    <Login v-if="!user.authenticated"/>
    <Wizard v-else-if="!wizard.completed && user.authenticated"/>

    <MainMenu v-if="wizard.completed && user.authenticated" class="main-menu"/>
    <!-- Dynamic component from layer name -->
    <main component v-if="wizard.completed && user.authenticated" :is="layer" class="main-content"/>
    <MediaControls v-if="wizard.completed && user.authenticated && layer !== 'settings'" :call="callActive"/>
</section>
