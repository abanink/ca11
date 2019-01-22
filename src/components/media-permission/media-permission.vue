<component class="c-media-permission">
    <div class="field">

        <div v-if="settings.webrtc.media.permission">
            <!-- Additional help to guide the user to the browser permission settings. -->
            <div class="mic-details">
                <div class="browser-bar cam-enabled">
                    <icon name="cam" class="cam"/>
                </div>
            </div>
            <span class="permission-message">
                {{$t('media is ready to use')}}!
            </span><br/>
        </div>
        <div v-else>
            <div class="mic-details">
                <div class="browser-bar cam-disabled">
                    <icon name="cam-disabled" class="cam"/>
                </div>
            </div>
            <span class="permission-message">
                {{$t('no media device permission', {name: app.name})}}
            </span><br/>

            <div v-if="!env.isExtension || (env.isExtension && env.isPopout)" class="cf instruction">
                {{$t('click on the device access icon in the browser navigation bar to fix this. The icon looks similar to the one above.', {name: app.name})}}
            </div>
            <div v-else>
                <span class="cf instruction">
                    {{$t('click on the microphone access button to open {name} in a browser tab. The permission can be adjusted from there.', {name: app.name})}}
                </span>
                <button class="button" @click="openPopoutView">
                    <span class="icon is-small"><icon name="mic"/></span>
                    <span class="cf">{{$t('microphone access')}}</span>
                </button>
            </div>
        </div>
    </div>
</component>
