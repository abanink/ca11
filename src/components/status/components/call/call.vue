<component class="c-status-call">

    <div class="c-status-call__protocol">
        <icon :name="`protocol-${call.protocol}`"/>
    </div>

    <div class="c-status-call__info">
        <span>{{callStatus}}</span>

        <span v-if="call.protocol === 'sig11'">
            <icon name="nodes"/>
            <span v-if="call.displayName" class="c-status-call__endpoint">{{call.displayName}}</span>
            <span v-else class="c-status-call__endpoint">
                {{call.endpoint.sid()}}
            </span>
        </span>
        <span v-else-if="call.protocol === 'sip'">
            <icon name="cloud"/>
            <span v-if="call.displayName" class="c-status-call__endpoint">{{call.displayName}}</span>
            <span v-else class="c-status-call__endpoint">
                {{call.endpoint}}
            </span>
        </span>
    </div>

    <div class="c-status-call__timer" v-if="call.status !== 'new'">
        {{sessionTime}}
    </div>

</component>
