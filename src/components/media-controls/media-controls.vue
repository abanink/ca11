<aside component="media-controls" class="c-media-controls">

    <!-- A preview of the current local stream -->
    <MediaStream
        :controls="false"
        :stream="stream[stream.type]"
        class="local"
        @click="toggleSelect"
    />

    <CallsSwitcher :call="callActive"/>
    <CallOptions :call="call"/>
</aside>
