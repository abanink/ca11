<component class="c-wizard-welcome">
    <header class="c-wizard__header">{{greeting}}!</header>

    <div class="c-wizard__description">
        <span class="cf">{{$t('{name} allows you to communicate worldwide for free with friends and colleagues on decentralized network SIG11. You can also optionally receive and make calls over a phone network with a VoIP account from a compatible provider. {name} first will ask you a couple of setup questions to get you started!', {name: app.name})}}</span>
    </div>

    <slot name="progress"></slot>

    <div class="buttons is-centered" v-if="selected.ready !== null">
        <button class="button" @click="stepBackFirst()">
            {{$t('cancel')}}
        </button>
        <button
            class="button is-primary test-wizard-welcome-next"
            @click="stepNext()"
        >{{$t('let\'s start')}}</button>
    </div>
</component>
