<component class="c-status main-status t-status">
    <transition name="c-status">
    <div class="c-status__menu">
        <!-- Popout link in WebExtension -->
        <button
            v-if="env.isExtension && !env.isPopout"
            class="c-status__option"
            @click="openPopoutView"
        ><icon name="ext-tab"/></button>

        <button
            class="c-status__option t-btn-settings tooltip tooltip-bottom"
            :class="{active: layer === 'settings'}"
            :data-tooltip="$t('settings')"
            @click="setLayer('settings')"
        ><icon name="settings"/></button>

        <button
            class="c-status__option tooltip tooltip-bottom"
            :class="{active: layer === 'about'}"
            :data-tooltip="$t('about {name}', {name: app.name})"
            @click="setLayer('about')"
        ><icon name="help"/></button>

        <Availability class="c-status__option dnd-switch" />
    </div>
    </transition>

    <div class="c-status__menu-side">
        <button
            v-if="sig11.enabled"
            class="c-status__indicator tooltip tooltip-left"
            :class="`t-st-status-sig11-${sig11.status}`"
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
            class="c-status__indicator tooltip tooltip-left"
            :class="`t-st-status-sip-${sip.status}`"
            :data-tooltip="tooltip.sip"
        >
            <div class="container" :class="classes('sip')">
            <icon name="mute" v-if="!settings.webrtc.media.permission"/>
            <icon name="mute" v-else-if="!settings.webrtc.devices.ready"/>
            <icon name="spinner" v-else-if="sip.status === 'loading'" class="spinner"/>
            <icon name="protocol-sip" v-else/>
            </div>
        </button>

        <button
            class="c-status__option tooltip tooltip-left"
            @click="logout"
            :data-tooltip="$t('quit session')"
        >
            <icon name="logout"/>
        </button>
    </div>

</component>
