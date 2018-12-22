<component class="c-main" id="app">
    <!-- Force the telemetry window to show up -->
    <Notifications :class="classes('notifications')"/>

    <div class="overlay" v-if="overlay">
        <div class="close-button" @click="closeOverlay()">
            <icon name="close"/>
        </div>
        <component v-bind:is="overlay"/>
    </div>

    <CallStatus
        v-if="callOngoing && callActive"
        class="main-status"
        :call="callActive"
    />
    <MainStatus v-else class="main-status"/>

    <Login v-if="!user.authenticated"/>
    <Wizard v-else-if="!wizard.completed && user.authenticated"/>

    <MainMenu v-if="wizard.completed && user.authenticated" class="main-menu"/>
    <!-- Dynamic component from layer name -->
    <component v-if="wizard.completed && user.authenticated" :is="layer" class="main-content"/>
</component>
