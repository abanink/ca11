<section component="settings" class="c-settings">

    <header class="content__header header">
        <icon class="header__icon" name="settings"/>

        <ul class="header__tabs">
            <li
                class="tooltip tooltip-bottom"
                :class="classes('tabs', 'general')"
                :data-tooltip="$t('general')"
                @click="setTab('settings', 'general')"
            >
                <icon name="settings-misc"/>
            </li>
            <li
                class="tooltip tooltip-bottom"
                :class="classes('tabs', 'devices')"
                :data-tooltip="$t('devices')"
                @click="setTab('settings', 'devices', settings.webrtc.enabled)"
            >
                <icon name="headset_mic"/>
            </li>
            <li
                class="tooltip tooltip-bottom"
                :class="classes('tabs', 'sig11')"
                :data-tooltip="$t('SIG11')"
                @click="setTab('settings', 'sig11')"
            >
                <icon name="protocol-sig11"/>
            </li>
            <li
                class="tooltip tooltip-bottom test-tab-phone"
                :class="classes('tabs', 'sip')"
                :data-tooltip="$t('SIP')"
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
                :help="$t('allow us to store anonymized application errors to improve {name}.', {name: app.name})"
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
                v-model="calls.sig11.toggled"
                name="sig11_enabled"
                :help="$t('free calling on decentralized network SIG11.')"
                :label="`${$t('SIG11 network')} (${$t('decentralized')})`"
            />

            <FieldText
                v-if="calls.sig11.toggled"
                v-model="calls.sig11.endpoint"
                name="sig11_endpoint"
                placeholder="e.g. sig11.websocket.tld"
                :help="$t('a SIG11 websocket endpoint used for signalling.')"
                :label="$t('signalling endpoint')"
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
        </div>


        <!-- SIP preferences -->
        <div class="tab" :class="{active: tabs.active === 'sip'}">
            <FieldCheckbox
                v-model="calls.sip.toggled"
                name="sip_enabled"
                :help="$t('subscription-based calling on a SIP network.')"
                :label="`${$t('SIP network')} (${$t('centralized')})`"
            />

            <FieldText
                v-if="calls.sip.toggled"
                v-model="calls.sip.endpoint"
                name="sip_endpoint"
                placeholder="e.g. sip.websocket.tld"
                :label="$t('SIP domain (WSS)')"
                :help="$t('a SIP-over-WSS (secure websockets) endpoint.')"
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

            <FieldPassword
                v-if="calls.sip.toggled"
                v-model="calls.sip.account.selected.password"
                name="sip_password"
                :label="$t('SIP password')"
                :placeholder="$t('SIP account secret')"
                :validation="$v.calls.sip.account.selected.password"
            />
        </div>

        <div class="tabs-actions">
            <button class="button test-settings-save" :disabled="$v.$invalid" @click="save">{{$t('save changes')}}</button>
        </div>
    </main>


</section>
