<component class="component-calls" :class="classes('component')">
    <!-- calling disabled -->
    <div v-if="!keypadEnabled" class="call-disabled">
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

    <!-- a call is ongoing -->
    <div v-else-if="callOngoing" class="call-active">
        <CallSwitch :call="callActive"/>
        <CallKeypadTouch
            v-if="callActive.status === 'new'"
            display="touch"
            mode="call"
            :endpoint="description.endpoint"
            :model.sync="description.endpoint"
        />
        <Call v-else :call="callActive"/>
    </div>

    <!-- starting without any active call -->
    <div class="call-new" v-else>
        <CallKeypadTouch :model.sync="description.endpoint" display="touch" mode="call" :endpoint="description.endpoint"/>
        <MediaStrip v-if="description.video"/>
    </div>
</component>
