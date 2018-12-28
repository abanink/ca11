<aside component="media-controls" class="c-media-controls">

    <!-- The local stream -->
    <MediaStream v-if="stream[stream.type].id" :stream="stream[stream.type]" class="local">
        <div slot="single-action" class="single-action">
            <icon :name="stream.type" @click="switchStream()"/>
        </div>
    </MediaStream>
    <div v-else class="c-media-stream loading">
        <div class="content">
            <icon name="spinner" class="spinner"/>
        </div>
    </div>

    <CallsSwitcher :call="callActive"/>
    <CallOptions :call="call"/>
</aside>
