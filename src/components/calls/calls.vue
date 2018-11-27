<component class="component-calls" :class="classes('component')">
    <CallKeypadTouch v-if="!callOngoing" :model.sync="description.endpoint" display="touch" mode="call" :endpoint="description.endpoint"/>
    <div v-else class="call-active">
        <div class="call-components">
            <CallKeypadTouch v-if="callActive.status === 'new'" :model.sync="description.endpoint" display="touch" mode="call" :endpoint="description.endpoint"/>
            <Call v-else :call="callActive"/>
            <CallSwitch :call="callActive"/>
        </div>
    </div>

    <!-- calling service not available -->
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

</component>
