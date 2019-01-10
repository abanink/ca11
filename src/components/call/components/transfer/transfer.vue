<component class="c-transfer">
    <div class="c-transfer__text cf">{{$t('select a transfer recipient')}}:</div>
    <DialerInput
        mode="call"
        :model.sync="description.endpoint"
        :endpoint="description.endpoint"
    />

    <div class="c-transfer__options">
        <button
            class="button c-transfer__button"
            :class="classes('attended-button')"
            @click="transferMode('attended')"
        >
            {{$t('attended transfer')}}
        </button>
        <button
            class="button c-transfer__button"
            :class="classes('blind-button')"
            @click="transferMode('blind')"
        >
            {{$t('blind transfer')}}
        </button>
    </div>



</component>
