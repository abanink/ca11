<component class="c-status-call">

    <div class="c-status-call__protocol">
        <icon :name="`call-${call.direction}`"/>
    </div>

    <div class="c-status-call__info">
        <span>
            <icon name="nodes" v-if="call.protocol === 'sig11'"/>
            <icon name="cloud" v-else-if="call.protocol === 'sig11'"/>
            <span v-if="call.name" class="c-status-call__number">{{call.name}} - </span>
            <span class="c-status-call__number">
                {{call.number}}
            </span>
        </span>
    </div>

    <div class="c-status-call__timer" v-if="call.status !== 'new'">
        {{sessionTime}}
    </div>

</component>
