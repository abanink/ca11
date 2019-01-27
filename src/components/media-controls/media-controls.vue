<aside component="media-controls" class="c-media-controls">

    <Stream
        :controls="false"
        :stream="stream[stream.type]"
        class="local"
        @click="toggleSelect"
    />

    <CallsSwitcher :call="callActive"/>

    <!-- A preview of the current local stream -->
    <div class="c-media-controls__bar">
        <CallOptions :call="call"/>
    </div>
</aside>
