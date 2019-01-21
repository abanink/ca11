<component class="c-call-switcher">

    <div class="container">
        <button v-if="call.status !== 'new'" v-for="call in calls"
            class="button call tooltip tooltip-left"
            :class="{active: call.active}"
            :data-tooltip="callTitle(call)"
            @click="activateCall(call)"
        >
            <icon :name="callIcon(call)"/>
        </button>

        <button
            class="button call placeholder tooltip tooltip-left"
            :class="{active: callActive.status === 'new' && ui.layer === 'calls', hint: 'true'}"
            :data-tooltip="$t('add new call')"
            @click="activateCall()"
        >
            <icon name="phone-add"/>
        </button>
    </div>
</component>
