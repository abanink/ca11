<component class="c-devices t-devices">
    <header class="c-wizard__header">
        {{$t('your audio settings')}}
    </header>

    <div class="c-wizard__description">
        {{$t('please notice that call sound quality depends a great deal on your audio setup.').ca()}}
        {{$t('a USB headset or earbuds with a microphone are recommended.').ca()}}

        <DeviceControls
            v-if="media.stream[media.stream.type].id && media.permission"
            :stream="media.stream[media.stream.type]"
        />
    </div>

    <slot name="progress"></slot>

    <div class="buttons stretched">
        <button
            class="button button--widget t-btn-devices-back"
            @click="stepBack()"
        >{{$t('back')}}</button>

        <button
            class="button button--widget is-primary t-btn-devices-next"
            @click="storeDevices()"
            :disabled="!stepValid"
        >{{$t('next')}}</button>
    </div>
</component>
