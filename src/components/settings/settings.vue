<section component class="c-settings t-settings">

    <header class="content__header header">
        <icon class="header__icon" name="settings"/>

        <ul class="header__tabs">
            <li
                class="button tooltip tooltip-bottom"
                :class="classes('tabs', 'general')"
                :data-tooltip="$t('general')"
                @click="setTab('settings', 'general')"
            >
                <icon name="settings-misc"/>
            </li>
            <li
                class="button tooltip tooltip-bottom"
                :class="classes('tabs', 'devices')"
                :data-tooltip="$t('devices')"
                @click="setTab('settings', 'devices', settings.webrtc.enabled)"
            >
                <icon name="headset_mic"/>
            </li>
            <li
                class="button tooltip tooltip-bottom"
                :class="classes('tabs', 'sig11')"
                data-tooltip="SIG11"
                @click="setTab('settings', 'sig11')"
            >
                <icon name="protocol-sig11"/>
            </li>
            <li
                class="button tooltip tooltip-bottom t-tab-sip"
                :class="classes('tabs', 'sip')"
                data-tooltip="SIP"
                @click="setTab('settings', 'sip')"
            >
                <icon name="protocol-sip"/>
            </li>
        </ul>
    </header>

    <main class="main">
        <!-- General settings -->
        <div class="tab" :class="{active: tabs.active === 'general'}">
            <FieldSelect
                v-model="settings.ringtones.selected"
                name="ringtone"
                :label="$t('ringtone')"
                :options="settings.ringtones.options">

                <button
                    slot="button"
                    class="button"
                    :disabled="playing.ringOutput"
                    @click="playSound('ringTone', 'ringOutput')"
                >
                    <icon name="call-active"/>
                </button>
            </FieldSelect>

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
                :help="$t('log anonymized application errors to Sentry in order to improve {name}.', {name: app.name})"
                :label="$t('exception telemetry')"
            />
        </div>


        <!-- Device settings -->
        <div class="tab" :class="{active: tabs.active === 'devices'}">
            <DeviceControls
                v-if="media.stream[media.stream.type].id && media.permission"
                :stream="media.stream[media.stream.type]"
            />
            <MediaPermission v-else/>
        </div>


        <!-- SIG11 preferences -->
        <div class="tab" :class="{active: tabs.active === 'sig11'}">
            <FieldCheckbox
                v-model="sig11.toggled"
                name="sig11_enabled"
                :help="$t('free, privacy-friendly calling on SIG11 network.')"
                :label="`SIG11 ${$t('network')} (${$t('decentralized')})`"
            />

            <FieldText
                v-if="sig11.toggled"
                v-model="sig11.endpoint"
                name="sig11_endpoint"
                placeholder="e.g. sig11.websocket.tld"
                help="SIG11 WebSocket Service"
                :label="`SIG11 ${$t('domain')}`"
                :validation="$v.sig11.endpoint"
            />

            <FieldTextarea
                v-if="sig11.toggled"
                v-model="sig11.identity.publicKey"
                name="sig11_identity"
                :help="$t('automatically unlock your session after restart.')"
                :label="$t('public identity')"
                :readonly="true"
            />
        </div>


        <!-- SIP preferences -->
        <div class="tab" :class="{active: tabs.active === 'sip'}">
            <FieldCheckbox
                v-model="sip.toggled"
                elementclass="t-cb-sip-toggled"
                name="sip_enabled"
                :help="$t('calling on SIP network using a VoIP provider.')"
                :label="`SIP ${$t('network')} (${$t('centralized')})`"
            />

            <FieldText
                v-if="sip.toggled"
                v-model="sip.endpoint"
                elementclass="t-txt-sip-endpoint"
                name="sip_endpoint"
                placeholder="e.g. sip.websocket.tld"
                :label="`SIP-WSS ${$t('domain')}`"
                help="SIP WebSocket Service"
                :validation="$v.sip.endpoint"
            />

            <FieldText
                v-if="sip.toggled"
                v-model="sip.account.selected.username"
                elementclass="t-txt-sip-username"
                name="sip_username"
                :label="`SIP ${$t('extension')}`"
                placeholder="1000"
                :validation="$v.sip.account.selected.username"
            />

            <FieldPassword
                v-if="sip.toggled"
                v-model="sip.account.selected.password"
                elementclass="t-txt-sip-password"
                name="sip_password"
                :label="`SIP ${$t('password')}`"
                :placeholder="`SIP ${$t('password')}`"
                :validation="$v.sip.account.selected.password"
            />
        </div>

        <div class="tabs-actions">
            <button
                class="button button--widget t-btn-settings-save"
                :disabled="$v.$invalid"
                @click="save"
            >{{$t('save settings')}}</button>
        </div>
    </main>


</section>
