<component class="c-welcome">
    <header class="c-wizard__header">{{greeting}}!</header>

    <div class="c-wizard__description">
        {{$t('{name} lets you communicate privately and freely with your family, friends and colleagues via decentralized network SIG11!', {name: app.name}).ca()}}
        {{$t('with {name}, you can also receive and make calls on a telephony network when you have an account from a compatible VoIP provider.', {name: app.name}).ca()}}
    </div>

    <slot name="progress"></slot>

    <div class="buttons is-centered" v-if="selected.ready !== null">
        <button
            class="button t-btn-welcome-cancel"
            @click="stepBackFirst()"
        >
            {{$t('cancel')}}
        </button>
        <button
            class="button is-primary t-btn-welcome-next"
            @click="stepNext()"
        >{{$t('start wizard')}}</button>
    </div>
</component>
