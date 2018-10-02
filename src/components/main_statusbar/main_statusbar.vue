<component class="component-main-statusbar" :class="classes()">

    <div v-if="!user.authenticated" class="vendor">
        <icon class="vendor-logo" name="logo"></icon>
        <span class="vendor-name">{{vendor.name}}</span>
    </div>
    <div class="status-left" v-else>
        <span class="status-indicator tooltip tooltip-right" :data-tooltip="tooltip">
            <icon name="mute" v-if="!settings.webrtc.media.permission"/>
            <icon name="mute" v-else-if="!settings.webrtc.devices.ready"/>
            <icon name="dnd" v-else-if="dnd"/>
            <icon name="dialer_sip" v-else-if="sip.enabled" :class="{spinner: (sig11.status === 'loading')}"/>
            <icon name="phone" v-else-if="sig11.enabled"/>
        </span>

        <span class="username">{{user.username}}</span>

    </div>

    <div class="options">

        <div class="option" @click="logout">
            <icon name="logout"/>
        </div>

        <!-- No real use in showing the popout view from an unauthenticated view -->
        <div class="option" v-if="env.isExtension && !env.isPopout" @click="openPopoutView">
            <icon class="ext-tab" name="ext-tab"/>
        </div>

        <div class="option test-statusbar-settings" :class="{active: layer === 'settings'}" @click="setLayer('settings')">
            <icon class="settings" name="settings"/>
        </div>

        <div class="option" :class="{active: layer === 'about'}" @click="setOverlay('about')">
            <icon name="help"/>
        </div>

    </div>
</component>
