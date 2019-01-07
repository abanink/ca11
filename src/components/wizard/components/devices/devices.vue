<component class="c-wizard-devices">
    <header class="c-wizard__header">{{$t('audio settings')}}</header>

    <div class="c-wizard__description">
        <span class="cf">{{$t('make sure your headset is properly connected and inspect the audio device settings below:')}}</span>
        <DeviceControls
            v-if="media.stream[media.stream.type].id && media.permission"
            :stream="media.stream[media.stream.type]"
        />
    </div>

    <slot name="progress"></slot>

    <div class="buttons is-centered">
        <button class="button test-wizard-devices-back" @click="stepBack()">
            {{$t('back')}}
        </button>
        <button class="button is-primary test-wizard-devices-next" @click="storeDevices()" :disabled="!stepValid">
            {{$t('finish')}}
        </button>
    </div>
</component>
