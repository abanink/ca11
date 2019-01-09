<component class="c-media-permission t-media-permission">
    <header class="c-wizard__header">{{$t('microphone access')}}</header>

    <div class="c-wizard__description">
        <span class="cf">
            {{$t('{name} needs permission to use your webcam and/or microphone to make audio/video calls.', {name: app.name})}}
        </span>
        <MediaPermission :soundmeter="false" />
        <span class="after-permission-text cf" v-if="permission">
            <span class="cf">{{$t('next, we are going to review your audio settings to make sure that you will have the best audio quality.', {name: app.name})}}</span>
        </span>
        <slot name="progress"></slot>

        <div class="buttons is-centered">
            <button
                class="button t-media-permission-back is-left"
                @click="stepBack()"
            >{{$t('back')}}</button>

            <button
                class="button is-primary t-media-permission-next"
                @click="queryDevices()"
                :disabled="!stepValid"
            >{{$t('next')}}</button>
        </div>
    </div>
</component>
