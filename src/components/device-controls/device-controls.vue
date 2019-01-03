<component class="c-device-controls">

    <FieldSelect
        v-model="devices.sinks.headsetInput"
        name="input_device"
        :help="$t('language used throughout the application.')"
        :label="$t('headset microphone')"
        :options="devices.input"
        :validation="$v.settings.webrtc.devices.sinks.headsetInput.valid"
    >
        <div slot="context" v-if="$v.settings.webrtc.devices.sinks.headsetInput.valid.customValid">
            <em class="help cf">{{$t('does the microphone of your headset respond?')}}</em>
            <Soundmeter v-if="stream[stream.type].id" class="soundmeter" :stream="stream[stream.type]"/>
        </div>
    </FieldSelect>

    <FieldSelect
        v-model="devices.sinks.headsetOutput"
        name="output_device"
        :help="$v.settings.webrtc.devices.sinks.headsetOutput.valid.customValid ? $t('does the sound test play on the expected device?') : ''"
        :label="$t('headset audio')"
        :options="devices.output"
        :validation="$v.settings.webrtc.devices.sinks.headsetOutput.valid"
    >
        <button
            slot="button"
            :disabled="playing.headsetOutput"
            @click="playSound('busyTone', 'headsetOutput')"
        >
            <icon name="call-active"/>
        </button>
    </FieldSelect>

    <FieldSelect
        v-model="devices.sinks.ringOutput"
        name="sounds_device"
        :help="$v.settings.webrtc.devices.sinks.ringOutput.valid.customValid ? $t('does the sound test play on the expected device?') : ''"
        :label="$t('ringtone audio')"
        :options="devices.output"
        :validation="$v.settings.webrtc.devices.sinks.ringOutput.valid"
    >
        <button
            slot="button"
            :disabled="playing.headsetOutput"
            @click="playSound('busyTone', 'headsetOutput')"
        >
            <icon name="call-active"/>
        </button>
    </FieldSelect>

    <FieldSelect
        v-model="devices.sinks.headsetOutput"
        name="output_device"
        :help="$v.settings.webrtc.devices.sinks.headsetOutput.valid.customValid ? $t('does the sound test play on the expected device?') : ''"
        :label="$t('headset audio')"
        :options="devices.output"
        :validation="$v.settings.webrtc.devices.sinks.headsetOutput.valid"
    >
        <button
            slot="button"
            :disabled="playing.headsetOutput"
            @click="playSound('busyTone', 'headsetOutput')"
        >
            <icon name="call-active"/>
        </button>
    </FieldSelect>

</component>
