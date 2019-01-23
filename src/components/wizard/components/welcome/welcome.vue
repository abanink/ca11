<component class="c-welcome">
    <header class="c-wizard__header">{{greeting}}!</header>

    <div class="c-wizard__description">
        {{$t('{name} lets you communicate privately and freely with family, friends and colleagues via decentralized network SIG11!', {name: app.name}).ca()}}
        {{$t('this onboarding wizard helps you to make your first call as quickly as possible.', {name: app.name}).ca()}}
    </div>

    <slot name="progress"></slot>

    <div class="buttons is-centered stretched" v-if="selected.ready !== null">
        <button
            class="button t-btn-welcome-cancel"
            @click="stepBackFirst()"
        >
            {{$t('cancel')}}
        </button>
        <button
            class="button is-primary t-btn-welcome-next"
            @click="stepNext()"
        >{{$t('next')}}</button>
    </div>
</component>
