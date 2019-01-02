<component class="c-call-status main-status">
    <div class="status-left">
        <span class="status-indicator">
            <icon v-if="call.protocol === 'sip'" class="vendor-logo" name="protocol-sip"/>
            <icon v-else-if="call.protocol === 'sig11'" class="vendor-logo" name="protocol-sig11"/>
        </span>
    </div>
    <div class="in-call-info">
        <div class="caller-status" v-if="call.status === 'new'">
            <span v-if="call.endpoint">{{call.endpoint}}</span>
            <span v-else>{{$t('enter a number').capitalize()}}</span>
        </div>
        <div class="caller-status" v-else>
            <template v-if="call.displayName">{{call.displayName}}</template>
            <template v-else>{{call.endpoint}}</template>
        </div>
        <div class="call-info" v-if="call.status === 'new'">
            <span class="cf">{{$t('new call')}}</span>
            <span class="timer"></span>
        </div>
        <div class="call-info" v-else>
            <span class="timer" v-if="call.timer.start">{{sessionTime}} - </span>
            <span>{{callStatus}}</span>
        </div>
    </div>
</component>
