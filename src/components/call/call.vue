<component class="component-call">
    <CallKeypadTouch
        v-if="call.keypad.active"
        mode="dtmf"
        :call="call"
        :endpoint="call.keypad.endpoint"
        :model.sync="call.keypad.endpoint"
    />
    <CallTransfer v-else-if="call.transfer.active && call.status === 'accepted'" :call="call"/>
    <CallMedia v-else :call="call"/>

    <MediaStrip :call="callActive"/>
</component>
