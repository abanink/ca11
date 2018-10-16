<component class="component-settings">

    <div class="tabs">
        <ul>
            <li :class="classes('tabs', 'identity')" @click="setTab('settings', 'identity')">
                <a><span class="icon is-small"><icon name="user"/></span><span class="cf">{{$t('identity')}}</span></a>
            </li>
            <li class="test-tab-phone" :class="classes('tabs', 'phone')" @click="setTab('settings', 'phone')">
                <a><span class="icon is-small"><icon name="phone"/></span><span class="cf">{{$t('calling')}}</span></a>
            </li>
            <li :class="classes('tabs', 'devices')" @click="setTab('settings', 'devices', settings.webrtc.enabled)">
                <a><span class="icon is-small"><icon name="microphone"/></span><span class="cf">{{$t('devices')}}</span></a>
            </li>
            <li :class="classes('tabs', 'privacy')" @click="setTab('settings', 'privacy')">
                <a><span class="icon is-small"><icon name="lock-on"/></span><span class="cf">{{$t('privacy')}}</span></a>
            </li>
        </ul>
    </div>


    <!-- Identity preferences -->
    <div class="tab" :class="{'is-active': tabs.active === 'identity'}">

        <Field name="language" type="select"
            :help="$t('language used throughout the application.')"
            :label="$t('application language')"
            :model.sync="language.selected"
            :options="language.options"
            :placeholder="$t('select a language')"/>

        <Field v-if="user.developer" name="language" type="textarea"
            :help="$t('blacklist sites that don\'t work well with Click-to-dial icons.')"
            :label="`${$t('click-to-Dial')} ${$t('blacklist')}`"
            :model.sync="settings.click2dial.blacklist"
            :placeholder="$t('use one line per site.')"/>

        <Field v-if="user.developer" name="platform_url" type="text"
            :label="$t('platform URL')"
            :model.sync="settings.platform.url"
            :help="$t('this URL is used to communicate with the platform API; don\'t change it unless you know what you\'re doing.')"
            :validation="$v.settings.platform.url"
            placeholder="https://"/>
    </div>


    <!-- Phone preferences -->
    <div class="tab tab-phone" :class="{'is-active': tabs.active === 'phone'}">

        <Field name="sip_enabled" type="checkbox"
            :label="$t('Phone network')"
            :model.sync="calls.sip.enabled"
            :help="$t('Register to a phone network using a VoIP provider. Your VoIP provider must support WSS-SIP and WebRTC.', {name: app.name})"/>

        <template v-if="calls.sip.enabled">
        <Field name="sip_endpoint" type="text"
            :label="$t('SIP domain (WSS)')"
            :model.sync="calls.sip.endpoint"
            placeholder="e.g. wss://websocket.example.org"/>

        <!-- Only show the username field with a 'new' session. -->
        <Field name="sip_username" type="text"
            :label="$t('SIP username')" :model.sync="calls.sip.account.selected.username"
            :placeholder="$t('account@example.org')"/>

        <Field name="sip_password" type="password"
            :label="$t('SIP password')" :model.sync="calls.sip.account.selected.password"
            :placeholder="$t('enter your password')"/>
        </template>

        <Field name="audio_post_processing" type="select"
            :label="$t('audio post-processing')"
            :model.sync="settings.webrtc.media.type.selected"
            :options="settings.webrtc.media.type.options"/>
    </div>


    <!-- Device settings -->
    <div class="tab" :class="{'is-active': tabs.active === 'devices'}">
        <DevicePicker v-if="settings.webrtc.media.permission"/>
        <MicPermission v-else/>
    </div>


    <!-- Privacy settings -->
    <div class="tab" :class="{'is-active': tabs.active === 'privacy'}">
        <Field name="store_key" type="checkbox"
            :label="$t('remember session')"
            :model.sync="app.vault.store"
            :help="$t('automatically unlock your session after restart.')">
        </Field>

        <Field name="telemetry_enabled" type="checkbox"
            :label="$t('telemetry')"
            :model.sync="settings.telemetry.enabled"
            :help="$t('we are able to improve the {name} faster, when you allow us to process anonymized data about usage statistics and application errors for analysis.', {name: app.name})"/>
    </div>


    <div class="tabs-actions field is-grouped">
        <button class="button is-primary cf test-settings-save" :disabled="$v.$invalid" @click="save">{{$t('save changes')}}</button>
    </div>
</component>
