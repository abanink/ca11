<component class="c-availability">
    <FieldCheckbox
        v-model="dnd"
        class="tooltip tooltip-bottom"
        :data-tooltip="$t('DND')"
        :disabled="!webrtc.enabled"
        name="dnd_availability"
    />
</component>
