<section component="settings" class="c-settings">

    <header class="content__header header">
        <icon class="header__icon" name="settings"/>

        <ul class="header__tabs">
            <li
                class="tooltip tooltip-right"
                :class="classes('tabs', 'general')"
                :data-tooltip="$t('general').capitalize()"
                @click="setTab('settings', 'general')"
            >
                <icon name="settings-misc"/>
            </li>
            <li
                class="tooltip tooltip-right"
                :class="classes('tabs', 'devices')"
                :data-tooltip="$t('devices').capitalize()"
                @click="setTab('settings', 'devices', settings.webrtc.enabled)"
            >
                <icon name="headset_mic"/>
            </li>
            <li
                class="tooltip tooltip-left"
                :class="classes('tabs', 'sig11')"
                :data-tooltip="$t('SIG11').capitalize()"
                @click="setTab('settings', 'sig11')"
            >
                <icon name="protocol-sig11"/>
            </li>
            <li
                class="tooltip tooltip-left test-tab-phone"
                :class="classes('tabs', 'sip')"
                :data-tooltip="$t('SIP').capitalize()"
                @click="setTab('settings', 'sip')"
            >
                <icon name="protocol-sip"/>
            </li>
        </ul>
    </header>


    <!-- General settings -->
    <main class="main tab" :class="{active: tabs.active === 'general'}">
        <FieldSelect
            v-model="language.selected"
            name="language"
            :help="$t('language used throughout the application.')"
            :label="$t('application language')"
            :options="language.options"
        />

        <FieldCheckbox
            v-model="app.vault.store"
            name="store_key"
            :help="$t('automatically unlock your session after restart.')"
            :label="$t('remember session')"
        />

        <FieldCheckbox
            v-model="settings.telemetry.enabled"
            name="store_key"
            :help="$t('allow us to store anonymized application errors to improve {name}.', {name: app.name})"
            :label="$t('exception telemetry')"
        />

        <FieldSelect
            v-model="settings.ringtones.selected"
            name="ringtone"
            :label="$t('ringtone')"
            :options="settings.ringtones.options">

            <button
                slot="button"
                :disabled="playing.ringOutput"
                @click="playSound('ringTone', 'ringOutput')"
            >
                <icon name="call-active"/>
            </button>
        </FieldSelect>
    </main>


    <!-- Device settings -->
    <main class="main tab" :class="{active: tabs.active === 'devices'}">
        <DeviceControls
            v-if="media.stream[media.stream.type].id && media.permission"
            :stream="media.stream[media.stream.type]"
        />
        <MediaPermission v-else/>
    </main>


    <!-- SIG11 preferences -->
    <main class="main tab" :class="{active: tabs.active === 'sig11'}">
        <FieldCheckbox
            v-model="calls.sig11.toggled"
            name="sig11_enabled"
            :label="$t('enable SIG11 protocol')"
        />

        <FieldText
            v-if="calls.sig11.toggled"
            v-model="calls.sig11.endpoint"
            name="sig11_endpoint"
            placeholder="e.g. sig11.websocket.tld"
            :help="$t('decentralized calling on overlay network SIG11.')"
            :label="$t('communication hub')"
            :validation="$v.calls.sig11.endpoint"
        />

        <FieldTextarea
            v-if="calls.sig11.toggled"
            v-model="user.identity.publicKey"
            name="sig11_identity"
            :help="$t('automatically unlock your session after restart.')"
            :label="$t('public identity')"
            :readonly="true"
        />
    </main>


    <!-- SIP preferences -->
    <main class="main tab tab-phone" :class="{active: tabs.active === 'sip'}">

        <FieldCheckbox
            v-model="calls.sip.toggled"
            name="sip_enabled"
            :help="$t('centralized calling on telecom SIP networks using Secure Websockets.', {name: app.name})"
            :label="$t('enable SIP protocol')"
        />

        <FieldText
            v-if="calls.sip.toggled"
            v-model="calls.sip.endpoint"
            name="sip_endpoint"
            placeholder="e.g. sip.websocket.tld"
            :label="$t('SIP domain (WSS)')"
            :validation="$v.calls.sip.endpoint"
        />

        <FieldText
            v-if="calls.sip.toggled"
            v-model="calls.sip.account.selected.username"
            name="sip_username"
            :label="$t('SIP Extension')"
            :placeholder="$t('1000')"
            :validation="$v.calls.sip.account.selected.username"
        />

        <FieldText
            v-if="calls.sip.toggled"
            v-model="calls.sip.account.selected.password"
            name="sip_password"
            :label="$t('SIP password')"
            :placeholder="$t('SIP account secret')"
            :validation="$v.calls.sip.account.selected.password"
        />
    </main>


    <footer class="tabs-actions field is-grouped">
        <button class="button is-primary cf test-settings-save" :disabled="$v.$invalid" @click="save">{{$t('save changes')}}</button>
    </footer>
</section>
