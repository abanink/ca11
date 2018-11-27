<component class="component-main" id="app">
    <!-- Force the telemetry window to show up -->
    <Notifications :class="classes('notifications')"/>

    <div class="overlay" v-if="overlay">
        <div class="close-button" @click="closeOverlay()">
            <icon name="close"/>
        </div>
        <component v-bind:is="overlay"/>
    </div>

    <Login v-if="!user.authenticated"/>
    <Wizard v-else-if="!wizard.completed && user.authenticated"/>
    <div v-else class="app-view">
        <MainCallBar v-if="callOngoing && callActive" class="app-view-top" :call="callActive"/>
        <MainStatusBar v-else class="app-view-top"/>

        <div class="app-view-main">
            <MainMenuBar class="app-view-sidebar"/>
            <!-- Dynamic component rendered from layer name -->
            <component v-bind:is="layer" class="app-view-layer"/>
        </div>
    </div>
</component>
