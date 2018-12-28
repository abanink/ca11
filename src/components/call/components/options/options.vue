<component class="c-call-options">

    <button
        v-if="!call.id"
        :disabled="!description.endpoint"
        class="media-controls-option tooltip tooltip-left"
        :data-tooltip="$t('place call').capitalize()"
        @click="placeCall(description)"
    >
        <icon name="phone"/>
    </button>

    <button
        v-if="call.status === 'invite'"
        class="media-controls-option tooltip tooltip-left"
        :data-tooltip="$t('accept call').capitalize()"
        @click="callAccept(call)"
    >
        <icon name="phone"/>
    </button>

    <button
        v-if="call.id && callCanTerminate"
        class="media-controls-option tooltip tooltip-left"
        :data-tooltip="$t('end call').capitalize()"
        @click="callTerminate(call)"
    >
        <icon name="call-end"/>
    </button>

    <button v-if="call.id"
        class="media-controls-option tooltip tooltip-left"
        :class="classes('dialpad-button')"
        :data-tooltip="$t('toggle keypad').capitalize()"
        :disabled="call.status !== 'accepted' || call.transfer.active"
        @click="keypadToggle"
    >
        <icon name="dialpad"/>
    </button>

    <button v-if="call.id"
        class="media-controls-option tooltip tooltip-left"
        :class="classes('hold-button')"
        :data-tooltip="$t('toggle on-hold').capitalize()"
        :disabled="call.status !== 'accepted'"
        @click="holdToggle"
    >
        <icon name="pause"/>
    </button>

    <button
        v-if="call.id && call.transfer.type !== 'accept'"
        class="media-controls-option tooltip tooltip-left"
        :class="classes('transfer-button')"
        :data-tooltip="$t('toggle transfer').capitalize()"
        :disabled="call.status !== 'accepted'"
        @click="transferToggle"
    >
        <icon name="transfer"/>
    </button>
    <button
        v-else-if="call.id"
        class="media-controls-option tooltip tooltip-left"
        :data-tooltip="$t('complete transfer').capitalize()"
        :disabled="call.status !== 'accepted'"
        @click="transferFinalize"
    >
        <icon name="merge"/>
    </button>
</component>
