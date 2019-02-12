<component class="c-welcome">
    <header class="c-wizard__header">{{$t('click-to-dial')}}</header>

    <div class="c-wizard__description">
        {{$t('{name} introduces free, secure and privacy-friendly audio and video web telephony to and from any number on a decentralized phone network.', {name: app.name}).ca()}}
        {{$t('do you also want to use {name} to dial clicked phone numbers on websites?', {name: app.name}).ca()}}<br/>

        <div class="cf c-wizard__help">
            {{$t('permission is asked after pressing').ca()}}<br/><em class="uc">{{$t('next')}}</em>
        </div>
    </div>

    <slot name="progress"></slot>

    <div class="buttons is-centered stretched" v-if="selected.ready !== null">
        <button
            class="button button--widget t-media-permission-back is-left"
            @click="stepBack()"
        >{{$t('back')}}</button>
        <button
            class="button button--widget is-primary t-btn-welcome-next"
            @click="triggerProtocolHandler()"
        >{{$t('next')}}</button>
    </div>
</component>
