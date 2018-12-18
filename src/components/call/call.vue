<component class="component-call">
    <div class="call-control">
        <CallOptions :call="call"/>
        <!-- DTMF keypad -->
        <div v-if="call.keypad.active">
            <CallKeypadTouch mode="dtmf" :model.sync="call.keypad.endpoint" :call="call" :endpoint="call.keypad.endpoint"/>
        </div>
        <CallTransfer v-else-if="call.transfer.active && ['accepted'].includes(call.status)"
            :call="call"
        />
        <CallMedia v-else :call="call"/>
    </div>

    <MediaStrip :call="callActive"/>
</component>
