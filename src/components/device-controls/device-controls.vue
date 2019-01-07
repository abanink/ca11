<component class="c-device-controls">

    <FieldSelect
        v-model="devices.sinks.headsetInput"
        name="headset_input"
        :help="$t('does the microphone of your headset respond?')"
        :label="$t('headset microphone')"
        :options="devices.input"
        :validation="$v.settings.webrtc.devices.sinks.headsetInput.valid"
    >
        <div slot="context" v-if="$v.settings.webrtc.devices.sinks.headsetInput.valid.customValid">
            <Soundmeter v-if="stream[stream.type].id" class="soundmeter" :stream="stream[stream.type]"/>
        </div>
    </FieldSelect>

    <FieldSelect
        v-model="devices.sinks.headsetOutput"
        name="headset_output"
        :help="$v.settings.webrtc.devices.sinks.headsetOutput.valid.customValid ? $t('does the sound test play on the expected device?') : ''"
        :label="$t('headset audio')"
        :options="devices.output"
        :validation="$v.settings.webrtc.devices.sinks.headsetOutput.valid"
    >
        <button
            class="button"
            slot="button"
            :disabled="playing.headsetOutput"
            @click="playSound('busyTone', 'headsetOutput')"
        >
            <icon name="call-active"/>
        </button>
    </FieldSelect>

    <FieldSelect
        v-model="devices.sinks.ringOutput"
        name="ring_output"
        :help="$v.settings.webrtc.devices.sinks.ringOutput.valid.customValid ? $t('does the sound test play on the expected device?') : ''"
        :label="$t('ringtone audio')"
        :options="devices.output"
        :validation="$v.settings.webrtc.devices.sinks.ringOutput.valid"
    >
        <button

            class="button"
            slot="button"
            :disabled="playing.headsetOutput"
            @click="playSound('busyTone', 'headsetOutput')"
        >
            <icon name="call-active"/>
        </button>
    </FieldSelect>

</component>
