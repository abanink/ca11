<section component="settings" class="c-settings">

    <header class="main-content-header">
        <icon class="header-icon" name="settings"/>
        <ul class="tabs">
            <li
                class="tooltip tooltip-right"
                :class="classes('tabs', 'general')"
                :data-tooltip="$t('general').capitalize()"
                @click="setTab('settings', 'general')"
            >
                <a><icon name="settings-misc"/></a>
            </li>
            <li
                class="tooltip tooltip-right"
                :class="classes('tabs', 'devices')"
                :data-tooltip="$t('devices').capitalize()"
                @click="setTab('settings', 'devices', settings.webrtc.enabled)"
            >
                <a><icon name="headset_mic"/></a>
            </li>
            <li
                class="tooltip tooltip-left"
                :class="classes('tabs', 'sig11')"
                :data-tooltip="$t('SIG11').capitalize()"
                @click="setTab('settings', 'sig11')"
            >
                <a><icon name="protocol-sig11"/></a>
            </li>
            <li
                class="tooltip tooltip-left test-tab-phone"
                :class="classes('tabs', 'sip')"
                :data-tooltip="$t('SIP').capitalize()"
                @click="setTab('settings', 'sip')"
            >
                <a><icon name="protocol-sip"/></a>
            </li>
        </ul>
    </header>


    <!-- General settings -->
    <main class="main-content-base tab" :class="{'is-active': tabs.active === 'general'}">
        <Field name="language" type="select"
            :help="$t('language used throughout the application.')"
            :label="$t('application language')"
            :model.sync="language.selected"
            :options="language.options"
            :placeholder="$t('select a language')"/>

        <Field name="store_key" type="checkbox"
            :label="$t('remember session')"
            :model.sync="app.vault.store"
            :help="$t('automatically unlock your session after restart.')">
        </Field>

        <Field name="telemetry_enabled" type="checkbox"
            :label="$t('exception telemetry')"
            :model.sync="settings.telemetry.enabled"
            :help="$t('allow us to store anonymized application errors to improve {name}.', {name: app.name})"/>
    </main>


    <!-- Device settings -->
    <main class="main-content-base tab" :class="{'is-active': tabs.active === 'devices'}">
        <DeviceControls
            v-if="media.stream[media.stream.type].id && media.permission"
            :stream="media.stream[media.stream.type]"
        />
        <MediaPermission v-else/>
    </main>


    <!-- SIG11 preferences -->
    <main class="main-content-base tab" :class="{'is-active': tabs.active === 'sig11'}">
        <Field name="sig11_enabled" type="checkbox"
            :label="$t('enable SIG11 protocol')"
            :model.sync="calls.sig11.toggled"
            :help="$t('decentralized calling on overlay network SIG11.')"/>

        <template v-if="calls.sig11.toggled">
        <Field name="sig11_endpoint" type="text"
            :label="$t('parent node (WSS)')"
            :model.sync="calls.sig11.endpoint"
            placeholder="websocket.sig11.example.org"
            :validation="$v.calls.sig11.endpoint"/>

        <Field name="public_key" class="network-public-key" type="textarea"
            :label="$t('public identity')"
            :model.sync="user.identity.publicKey"
            :help="$t('automatically unlock your session after restart.')"
            placeholder=''
            :readonly="true"/>
        </template>
    </main>


    <!-- SIP preferences -->
    <main class="main-content-base tab tab-phone" :class="{'is-active': tabs.active === 'sip'}">
        <Field name="sip_enabled" type="checkbox"
            :label="$t('enable SIP protocol')"
            :model.sync="calls.sip.toggled"
            :help="$t('centralized calling on telecom SIP networks using Secure Websockets.', {name: app.name})"/>

        <template v-if="calls.sip.toggled">
        <Field name="sip_endpoint" type="text"
            :label="$t('SIP domain (WSS)')"
            :model.sync="calls.sip.endpoint"
            placeholder="sip.websocket.example.org"
            :validation="$v.calls.sip.endpoint"/>

        <!-- Only show the username field with a 'new' session. -->
        <Field name="sip_username" type="text"
            :label="$t('SIP Extension')" :model.sync="calls.sip.account.selected.username"
            :placeholder="$t('411')"
            :validation="$v.calls.sip.account.selected.username"/>

        <Field name="sip_password" type="password"
            :label="$t('SIP password')" :model.sync="calls.sip.account.selected.password"
            :placeholder="$t('SIP account secret')"
            :validation="$v.calls.sip.account.selected.password"/>
        </template>
    </main>


    <footer class="tabs-actions field is-grouped">
        <button class="button is-primary cf test-settings-save" :disabled="$v.$invalid" @click="save">{{$t('save changes')}}</button>
    </footer>
</section>
