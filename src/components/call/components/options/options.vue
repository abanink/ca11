<component class="c-call-options">

    <!-- <div class="option">
        <div class="rounded-button" @click="muteToggle" :class="classes('mute-button')">
            <icon name="mic-off"/>
        </div>
        <p class="ca">{{$t('mute')}}</p>
    </div> -->


    <!-- place new call button -->
    <button
        v-if="!call.id"
        :disabled="!description.endpoint"
        class="option tooltip tooltip-left" @click="placeCall(description)"
        :data-tooltip="$t('place call').capitalize()"
    >
        <icon name="phone"/>
    </button>


    <button
        v-if="call.status === 'invite'"
        class="option tooltip tooltip-left" @click="callAccept(call)"
        :data-tooltip="$t('accept call').capitalize()"
    >
        <icon name="phone"/>
    </button>

    <button v-if="call.id"
        class="option tooltip tooltip-left"
        :class="classes('dialpad-button')"
        :data-tooltip="$t('toggle keypad').capitalize()"
        :disabled="call.status !== 'accepted'"
        @click="keypadToggle"
    >
        <icon name="dialpad"/>
    </button>

    <button v-if="call.id"
        class="option tooltip tooltip-left"
        :class="classes('hold-button')"
        :data-tooltip="$t('toggle on-hold').capitalize()"
        :disabled="call.status !== 'accepted'"
        @click="holdToggle"
    >
        <icon name="call-hold"/>
    </button>

    <button
        v-if="call.id && call.transfer.type !== 'accept'"
        class="option tooltip tooltip-left"
        :class="classes('transfer-button')"
        :data-tooltip="$t('toggle transfer').capitalize()"
        :disabled="call.status !== 'accepted'"
        @click="transferToggle"
    >
        <icon name="transfer"/>
    </button>
    <button
        v-else-if="call.id" @click="transferFinalize"
        class="option tooltip tooltip-left"
        :data-tooltip="$t('complete transfer').capitalize()"
        :disabled="call.status !== 'accepted'">
        <icon name="merge"/>
    </button>

    <button
        v-if="call.id && callCanTerminate"
        class="option tooltip tooltip-left"
        @click="callTerminate(call)"
        :data-tooltip="$t('end call').capitalize()"
    >
        <icon name="call-end"/>
    </button>

</component>
