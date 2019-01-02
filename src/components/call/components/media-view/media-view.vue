<section component class="media-view" :class="classes('component')">
    <!-- remote streams -->
    <MediaStream :stream="stream" v-for="stream of selectedStreams"/>

    <div class="media-stream media-stream__placeholder" v-if="!stream[stream.type].selected && !selectedStreams.length">
        <div class="content">
            <div class="call-stats">
                <icon name="call-active"/>
                <div class="endpoint">{{call.endpoint}}</div>
                <div class="time">{{sessionTime}}</div>
                <div class="status">{{callStatus}}</div>
            </div>
        </div>
    </div>
</section>
