<component class="c-media-permission t-media-permission">
    <header class="c-wizard__header">{{$t('microphone access')}}</header>

    <div class="c-wizard__description">
        <span class="cf">
            {{$t('{name} requires your permission to use the computer webcam and microphone for audio and video calls.', {name: app.name})}}
        </span>
        <MediaPermission :soundmeter="false" />

        <slot name="progress"></slot>

        <div class="buttons stretched">
            <button
                class="button button--widget t-btn-media-permission-back is-left"
                @click="stepBack()"
            >{{$t('back')}}</button>

            <button
                class="button button--widget is-primary t-btn-media-permission-next"
                @click="queryDevices()"
                :disabled="!stepValid"
            >{{$t('next')}}</button>
        </div>
    </div>
</component>
