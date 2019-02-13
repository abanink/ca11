<component class="c-status-call">

    <div class="c-status-call__direction">
        <icon :name="`call-${call.direction}`"/>
    </div>

    <div class="c-status-call__endpoint">
        <span>
            <span v-if="call.name" class="c-status-call__number">{{call.name}} - </span>
            <span class="c-status-call__number">
                {{call.number}}
            </span>
        </span>
    </div>

    <div class="c-status-call__status">
        <span>{{callStatus}}</span>
        <icon name="nodes" v-if="call.protocol === 'sig11'"/>
        <icon name="cloud" v-else-if="call.protocol === 'sip'"/>
        <span class="c-status-call__status-timer">{{sessionTime}}</span>
    </div>

</component>
