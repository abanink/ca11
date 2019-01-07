<component class="c-wizard-welcome">
    <header class="c-wizard__header">{{greeting}}!</header>

    <div class="c-wizard__description">
        <span class="cf">{{$t('to get started, we first have to ask you a couple of setup questions. All of these settings can be changed later from the settings menu.', {name: app.name})}}</span>
    </div>

    <slot name="progress"></slot>

    <div class="buttons is-centered" v-if="selected.ready !== null">
        <button class="button" @click="stepBackFirst()">
            {{$t('log out')}}
        </button>
        <button type="button" class="button is-primary cf test-wizard-welcome-next" @click="stepNext()">{{$t('let\'s start')}}</button>
    </div>
</component>
