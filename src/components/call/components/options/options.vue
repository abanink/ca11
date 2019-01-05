<component class="c-call-options">

    <button
        v-if="!call.id && ui.layer === 'calls'"
        :disabled="!description.endpoint"
        class="media-controls-option tooltip tooltip-left"
        :data-tooltip="$t('place call')"
        @click="placeCall(description)"
    >
        <icon name="phone"/>
    </button>

    <button
        v-if="call.status === 'invite'"
        class="media-controls-option tooltip tooltip-left"
        :data-tooltip="$t('accept call')"
        @click="callAccept(call)"
    >
        <icon name="phone"/>
    </button>

    <button
        v-if="call.id && callCanTerminate"
        class="media-controls-option tooltip tooltip-left"
        :data-tooltip="$t('end call')"
        @click="callTerminate(call)"
    >
        <icon name="call-end"/>
    </button>

    <button v-if="call.id"
        class="media-controls-option tooltip tooltip-left"
        :class="classes('dialpad-button')"
        :data-tooltip="$t('toggle keypad')"
        :disabled="call.status !== 'accepted' || call.transfer.active"
        @click="keypadToggle"
    >
        <icon name="dialpad"/>
    </button>

    <button v-if="call.id"
        class="media-controls-option tooltip tooltip-left"
        :class="classes('hold-button')"
        :data-tooltip="$t('toggle on-hold')"
        :disabled="call.status !== 'accepted'"
        @click="holdToggle"
    >
        <icon name="pause"/>
    </button>

    <button
        v-if="call.id && call.transfer.type !== 'accept'"
        class="media-controls-option tooltip tooltip-left"
        :class="classes('transfer-button')"
        :data-tooltip="$t('toggle transfer')"
        :disabled="call.status !== 'accepted'"
        @click="transferToggle"
    >
        <icon name="transfer"/>
    </button>
    <button
        v-else-if="call.id"
        class="media-controls-option tooltip tooltip-left"
        :data-tooltip="$t('complete transfer')"
        :disabled="call.status !== 'accepted'"
        @click="transferFinalize"
    >
        <icon name="merge"/>
    </button>
</component>
