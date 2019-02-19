<component class="c-protocol-handler t-protocol-handler">
    <header class="c-wizard__header">{{$t('click-to-dial')}}</header>

    <div class="c-wizard__description">
        {{$t('phone hyperlinks (e.g. tel:1187654321) on websites can be associated with the {name} phone.', {name: app.name}).ca()}}
        {{$t('do you want {name} to open after clicking on such links?', {name: app.name}).ca()}}<br/>


        <div class="cf c-wizard__help">
            {{$t('browser permission is asked after pressing').ca()}}<br/><em class="uc">{{$t('next')}}</em>
        </div>
    </div>

    <slot name="progress"></slot>

    <div class="buttons is-centered stretched" v-if="selected.ready !== null">
        <button
            class="button button--widget t-btn-protocol-handler-back is-left"
            @click="stepBack()"
        >{{$t('back')}}</button>
        <button
            class="button button--widget is-primary t-btn-protocol-handler-next"
            @click="triggerProtocolHandler()"
        >{{$t('next')}}</button>
    </div>
</component>
