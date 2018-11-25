<component class="component-availability">

    <Field name="dnd_availability" type="checkbox"
        css="is-warning"
        :disabled="!webrtc.enabled"
        :label="$t('DnD')"
        :model.sync="dnd"/>

    <!-- Load additional availability addons. -->
    <template v-for="addon of addons">
        <component v-bind:is="addon"></component>
    </template>
</component>
