<component class="c-call-transfer">
    <div class="transfer-options">
        <div class="transfer-buttons">
            <div class="transfer-button ca" :class="classes('attended-button')" @click="transferMode('attended')">
                {{$t('attended transfer')}}
            </div>
            <div class="transfer-button ca" :class="classes('blind-button')" @click="transferMode('blind')">
                {{$t('blind transfer')}}
            </div>
        </div>
        <div class="transfer-text cf">{{$t('select a transfer recipient')}}:</div>

        <DialerInput mode="call" :model.sync="description.endpoint" :endpoint="description.endpoint"/>
    </div>
</component>
