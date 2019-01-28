<component class="c-welcome">
    <header class="c-wizard__header">{{$t('welcome')}}!</header>

    <div class="c-wizard__description">
        {{$t('{name} is a decentralized internet telephony platform for secure free calling, conferencing and collaboration.', {name: app.name}).ca()}}
        {{$t('click on the "next" button to start with verifying your phone settings.').ca()}}
    </div>

    <slot name="progress"></slot>

    <div class="buttons is-centered stretched" v-if="selected.ready !== null">
        <button
            class="button button--widget t-btn-welcome-cancel"
            @click="stepBackFirst()"
        >
            {{$t('cancel')}}
        </button>
        <button
            class="button button--widget is-primary t-btn-welcome-next"
            @click="stepNext()"
        >{{$t('next')}}</button>
    </div>
</component>
