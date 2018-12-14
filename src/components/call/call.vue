<component class="component-call">
    <!-- <CallMedia :call="call"/> -->


    <div class="call-info" v-if="(!call.keypad.active || call.keypad.display === 'dense') && !['new'].includes(call.status)">
        <icon class="contact-avatar" name="contact"/>
        <div class="info-number">{{call.endpoint}}</div>
        <div class="info-name" v-if="call.displayName">{{call.displayName}}</div>
        <div class="info-status">
            <span>{{sessionTime}} - </span>
            <span>{{callStatus}}</span>
        </div>
    </div>

    <!-- DTMF keypad -->
    <div v-if="call.keypad.active">
        <CallKeypadTouch mode="dtmf" :model.sync="call.keypad.endpoint" :call="call" :endpoint="call.keypad.endpoint"/>
    </div>

    <CallOptions v-if="['accepted'].includes(call.status)"
        :call="call"
    />
    <Soundmeter class="soundmeter"/>

    <!-- Show only when transfer is active and the call is still active -->
    <CallTransfer v-if="call.transfer.active && ['accepted'].includes(call.status)"
        :call="call"
    />

    <div class="call-actions" v-if="!call.hangup.disabled">
        <div class="rounded-button action decline test-button-terminate" v-if="callCanTerminate"
            @click="callTerminate(call)">
            <icon name="call-end"/>
        </div>

        <div class="rounded-button action accept test-button-accept" v-if="call.status === 'invite'" @click="callAccept(call)">
            <icon name="phone"/>
        </div>
    </div>

</component>
