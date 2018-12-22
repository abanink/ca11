<component class="c-media-controls">

    <!-- The local stream -->
    <MediaStream v-if="stream[stream.type].id" :stream="stream[stream.type]" class="local">
        <div slot="actions">
            <div class="actions">
            <icon :name="stream.type" @click="switchStream()"/>
             </div>
        </div>
    </MediaStream>
    <div v-else class="media-container loading">
        <div class="content">
            <icon name="spinner" class="spinner"/>
        </div>
    </div>

    <!-- don't render with only a call description -->
    <CallOptions :call="call"/>
</component>
