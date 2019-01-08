<section component class="media-view" :class="classes('component')">
    <!-- remote streams -->
    <MediaStream :stream="stream" v-for="stream of selectedStreams"/>

    <div
        v-if="!stream[stream.type].selected && !selectedStreams.length"
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
    </div>
</section>
