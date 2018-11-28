<component class="component-settings">

    <div class="tabs">
        <ul>
            <li :class="classes('tabs', 'general')" @click="setTab('settings', 'general')">
                <a><icon name="settings-misc"/><span class="cf">{{$t('general')}}</span></a>
            </li>
            <li :class="classes('tabs', 'devices')" @click="setTab('settings', 'devices', settings.webrtc.enabled)">
                <a><icon name="headset_mic"/><span class="cf">{{$t('devices')}}</span></a>
            </li>
            <li :class="classes('tabs', 'sig11')" @click="setTab('settings', 'sig11')">
                <a><icon name="sig11"/><span class="cf">{{$t('SIG11')}}</span></a>
            </li>
            <li class="test-tab-phone" :class="classes('tabs', 'sip')" @click="setTab('settings', 'sip')">
                <a><icon name="phone-sip"/><span class="cf">{{$t('SIP')}}</span></a>
            </li>
        </ul>
    </div>


    <!-- General settings -->
    <div class="tab" :class="{'is-active': tabs.active === 'general'}">
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
    </div>


    <!-- Device settings -->
    <div class="tab" :class="{'is-active': tabs.active === 'devices'}">
        <DevicePicker v-if="settings.webrtc.media.permission"/>
        <MicPermission v-else/>
    </div>


    <!-- SIG11 preferences -->
    <div class="tab" :class="{'is-active': tabs.active === 'sig11'}">
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
    </div>


    <!-- SIP preferences -->
    <div class="tab tab-phone" :class="{'is-active': tabs.active === 'sip'}">
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
    </div>


    <div class="tabs-actions field is-grouped">
        <button class="button is-primary cf test-settings-save" :disabled="$v.$invalid" @click="save">{{$t('save changes')}}</button>
    </div>
</component>
