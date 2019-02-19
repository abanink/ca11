<component class="c-media-controls">
    <Stream
        v-if="!callsExist"
        :controls="false"
        :stream="stream[stream.type]"
        class="local"
        @click="toggleSelect"
    />

    <CallsSwitcher/>

    <div class="c-media-controls__bar">
        <CallOptions :call="call"/>
    </div>
</component>
