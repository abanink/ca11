<component class="component-call-options">

    <!-- <div class="option">
        <div class="rounded-button" @click="muteToggle" :class="classes('mute-button')">
            <icon name="mic-off"/>
        </div>
        <p class="ca">{{$t('mute')}}</p>
    </div> -->

    <button v-if="callCanTerminate" class="option" @click="callTerminate(call)">
        <icon name="call-end"/>
    </button>

    <button v-if="call.status === 'invite'" class="option" @click="callAccept(call)">
        <icon name="phone"/>
    </button>

    <template v-if="call.status === 'accepted'">

    <button
        v-if="call.transfer.type !== 'accept'"
        @click="transferToggle"
        class="option"
        :class="classes('transfer-button')"
        :disabled="call.status !== 'accepted'"
    >
        <icon name="transfer"/>
    </button>
    <button class="option" v-else @click="transferFinalize" :disabled="call.status !== 'accepted'">
        <icon name="merge"/>
    </button>

    <button class="option" @click="holdToggle" :class="classes('hold-button')" :disabled="call.status !== 'accepted'">
        <icon name="call-hold"/>
    </button>

    <button class="option" @click="keypadToggle" :class="classes('dialpad-button')" :disabled="call.status !== 'accepted'">
        <icon name="dialpad"/>
    </button>
    </template>

</component>
