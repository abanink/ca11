<component class="c-call-media-view" :class="classes('component')">

    <div class="media-view">
        <!-- local stream -->
        <MediaStream :stream="stream[stream.type]" v-if="stream[stream.type].selected"/>
        <!-- remote streams -->
        <MediaStream :stream="stream" v-for="stream of selectedStreams"/>

        <div class="c-media-stream placeholder" v-if="!stream[stream.type].selected && !selectedStreams.length">
            <div class="content">
                <div class="call-stats">
                    <icon name="call-active"/>
                    <div class="endpoint">{{call.endpoint}}</div>
                    <div class="time">{{sessionTime}}</div>
                    <div class="status">{{callStatus}}</div>
                </div>
            </div>
        </div>
    </div>
</component>
