<section component class="c-main" :class="classes('component')">
    <!-- Force the telemetry window to show up -->
    <Notifications :class="classes('notifications')"/>

    <div class="c-main__overlay" v-if="overlay">
        <div class="close-button" @click="closeOverlay()">
            <icon name="close"/>
        </div>
        <component v-bind:is="overlay"/>
    </div>

    <transition v-if="wizard.completed && user.authenticated" name="c-main__status">
        <CallStatus
            v-if="callOngoing && callActive"
            class="c-main__status"
            :call="callActive"
        />
        <MainStatus v-else class="c-main__status"/>
    </transition>

    <Login v-if="!user.authenticated"/>
    <Wizard v-else-if="!wizard.completed && user.authenticated"/>

    <MainMenu v-if="wizard.completed && user.authenticated" class="c-main__menu"/>
    <!-- Dynamic component from layer name -->
    <main component v-if="wizard.completed && user.authenticated" :is="layer" class="c-main__content"/>
    <MediaControls v-if="wizard.completed && user.authenticated && layer !== 'settings'" :call="callActive"/>
</section>
