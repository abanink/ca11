<component class="c-call">
    <CallTransfer
        v-if="call.transfer.active && call.status === 'accepted'"
        :call="call"
    />
    <Keypad
        v-else-if="call.keypad.active"
        mode="dtmf"
        :call="call"
        :endpoint="call.keypad.endpoint"
        :model.sync="call.keypad.endpoint"
    />
    <!-- the default view -->
    <CallMediaView v-else :call="call"/>
</component>
