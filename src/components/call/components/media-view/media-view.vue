<transition-group class="c-media-view" :class="classes('component')" appear name="tr-stream" tag="component">
    <!-- call information/placeholder -->
    <article
        key="placeholder"
        class="media-stream media-stream__placeholder"
    >
        <icon class="media-stream-icon" name="call-active"/>
        <div class="content">
            <div class="media-stream__stats">
                <div class="media-stream__endpoint">{{call.endpoint}}</div>
                <div class="media-stream__time">{{sessionTime}}</div>
                <div class="media-stream__status">{{callStatus}}</div>
            </div>
        </div>
    </article>
     <!-- all selected streams, including the local stream -->
    <MediaStream :key="stream.id" :stream="stream" v-for="stream of selectedStreams"/>
</transition-group>

