<component class="c-status-menu">

    <div class="c-status-menu__menu">
        <button
            class="button button--menu c-status-menu__button t-btn-settings tooltip tooltip-bottom"
            :class="{active: layer === 'settings'}"
            :data-tooltip="$t('settings')"
            @click="setLayer('settings')"
        ><icon name="settings"/></button>

        <button
            class="button button--menu c-status-menu__button tooltip tooltip-bottom"
            :class="{active: layer === 'about'}"
            :data-tooltip="$t('about {name}', {name: app.name})"
            @click="setLayer('about')"
        ><icon name="about"/></button>

        <Dnd class="c-status-menu__option dnd-switch" />
    </div>

    <div class="c-status-menu__menu-side">
        <button
            v-if="sig11.enabled"
            class="c-status-menu__indicator tooltip tooltip-left"
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
            class="c-status-menu__indicator tooltip tooltip-left"
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
            class="button button--menu c-status-menu__button tooltip tooltip-left"
            @click="logout"
            :data-tooltip="$t('quit')"
        >
            <icon name="logout"/>
        </button>
    </div>

</component>
