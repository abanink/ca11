<component class="c-call-switcher">

    <div class="container">
        <div v-if="call.status !== 'new'" v-for="call in calls"
            class="call tooltip tooltip-left"
            :class="{active: call.active}"
            :data-tooltip="callTitle(call)"
            @click="activateCall(call)"
        >
            <icon :name="callIcon(call)"/>
        </div>

        <div
            class="call placeholder tooltip tooltip-left"
            :class="{active: callActive.status === 'new'}"
            :data-tooltip="$t('setup new call')"
            @click="activateCall()"
        >
            <icon name="phone-add"/>
        </div>
    </div>
</component>
