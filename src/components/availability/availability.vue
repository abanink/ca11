<component class="c-availability">
    <FieldCheckbox
        v-model="dnd"
        :disabled="!webrtc.enabled"
        name="dnd_availability"
        :label="$t('DND')"
    />
</component>
