<component class="component-calls" :class="classes('component')">
    <div v-if="activeCall" class="call-active">
        <div class="call-components">
            <Call :call="activeCall"/>
            <CallSwitch :call="activeCall"/>
        </div>
        <Soundmeter class="soundmeter"/>
    </div>
    <div v-else-if="!keypadEnabled" class="calls-disabled">
        <icon class="disabled-icon" name="dialpad-off"/>
        <div class="disabled-text">
            <span class="cf">{{$t('service unavailable.')}}</span><br/>
            <span class="cf">{{$t('what\'s wrong?')}}</span>
        </div>
        <div class="disabled-reason">
            <ul>
                <li v-for="reason in callingDisabled">
                    {{translations('callingDisabled', reason)}}
                </li>
            </ul>
        </div>
    </div>
    <div v-else>
        <CallKeypad :model.sync="call.endpoint" display="touch" mode="call" :endpoint="call.endpoint"/>
        <Soundmeter class="soundmeter"/>
    </div>
</component>
