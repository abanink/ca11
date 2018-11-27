<component class="component-call-switch">
    <!-- First loop through all the active calls -->
    <div v-if="call.status !== 'new'" v-for="call in calls"
        @click="activateCall(call)"
        class="call tooltip tooltip-left"
        :class="{active: call.active}"
        :data-tooltip="callTitle(call)">
        <icon :name="callIcon(call)"/>
    </div>

    <!-- New call always end up at the bottom, but only if we are already in an accepted call. -->
    <div @click="activateNewCall()"
        class="call tooltip tooltip-left"
        :class="{active: callActive.status === 'new'}"
        :data-tooltip="$t('setup new call').capitalize()">
        <icon name="phone-add"/>
    </div>
</component>
