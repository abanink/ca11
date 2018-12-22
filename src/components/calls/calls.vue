<component class="c-calls" :class="classes('component')">

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

    <CallsSwitcher :call="callActive"/>
    <Call v-if="callActive.id" :call="callActive"/>
    <!-- starting without any active call -->
    <DialerTouch
        v-else
        display="touch"
        mode="call"
        :endpoint="description.endpoint"
        :model.sync="description.endpoint"
    />


    <MediaControls v-if="ui.strip" :call="callActive"/>
</component>
