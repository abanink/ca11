<component class="c-sig11 t-sig11">
    <header class="c-wizard__header">{{$t('choose your number')}}</header>

    <div class="c-wizard__description">

        {{$t('{name} introduces free, secure and privacy-friendly audio and video web telephony to and from any number.', {name: app.name}).ca()}}
        {{$t('choose your display name and the number that people can use to call you.').ca()}}
        <br/><br/>

        <FieldText
            v-model="sig11.identity.name"
            elementclass="t-txt-sig11-name"
            name="sig11_name"
            :help="$t('this name identifies you to callees.')"
            :label="$t('display name')"
        />

        <FieldText
            v-model="sig11.identity.number"
            elementclass="t-txt-sig11-number"
            name="sig11_number"
            :help="$t('a number on the network that people can call you on.')"
            :label="`SIG11 ${$t('number')}`"
        />
    </div>

    <slot name="progress"></slot>

    <div class="buttons is-centered stretched" v-if="selected.ready !== null">
        <button
            class="button button--widget t-btn-sig11-cancel"
            @click="stepBackFirst()"
        >
            {{$t('cancel')}}
        </button>
        <button
            class="button button--widget is-primary t-btn-sig11-next"
            @click="updateIdentity()"
        >{{$t('next')}}</button>
    </div>
</component>
