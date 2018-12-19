<component class="component-call-media" :class="classes('component')">
    <!-- local stream -->
    <MediaStream :stream="stream" v-if="stream.selected"/>

    <!-- remote streams -->
    <MediaStream :stream="stream" v-for="stream of selectedStreams"/>

    <div class="media-container placeholder" v-if="!stream.selected && !selectedStreams.length">
        <div class="content">
            <div class="call-stats">
                <icon name="call-active"/>
                <div class="endpoint">{{call.endpoint}}</div>
                <div class="time">{{sessionTime}}</div>
                <div class="status">{{callStatus}}</div>
            </div>
        </div>
    </div>

</component>
