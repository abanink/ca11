<component class="c-main-status main-status status">
    <transition name="c-main__status">
    <div class="status__menu">
        <!-- Popout link in WebExtension -->
        <button class="status__option" v-if="env.isExtension && !env.isPopout" @click="openPopoutView">
            <icon class="ext-tab" name="ext-tab"/>
        </button>

        <button
            class="status__option test-statusbar-settings"
            :class="{active: layer === 'settings'}"
            @click="setLayer('settings')"
        >
            <icon class="settings" name="settings"/>
        </button>

        <button
            class="status__option"
            :class="{active: layer === 'about'}"
            @click="setLayer('about')"
        >
            <icon name="help"/>
        </button>


        <Availability class="status__option dnd-switch" />
    </div>
    </transition>



    <div class="status__menu-side">

        <button
            v-if="sig11.enabled"
            class="status__indicator tooltip tooltip-left"
            :data-tooltip="tooltip.sig11"
        >
            <div class="container" :class="classes('sig11')">
            <icon name="mute" v-if="!settings.webrtc.media.permission"/>
            <icon name="mute" v-else-if="!settings.webrtc.devices.ready"/>
            <icon name="spinner" v-else-if="sig11.status === 'loading'" class="spinner"/>
            <icon name="protocol-sig11" v-else/>
            </div>
        </button>

        <button
            v-if="sip.enabled"
            class="status__indicator tooltip tooltip-left"
            :data-tooltip="tooltip.sip"
        >
            <div class="container" :class="classes('sip')">
            <icon name="mute" v-if="!settings.webrtc.media.permission"/>
            <icon name="mute" v-else-if="!settings.webrtc.devices.ready"/>
            <icon name="spinner" v-else-if="sip.status === 'loading'" class="spinner"/>
            <icon name="protocol-sip" v-else/>
            </div>
        </button>


        <button class="status__option" @click="logout">
            <icon name="logout"/>
        </button>
    </div>

</component>
