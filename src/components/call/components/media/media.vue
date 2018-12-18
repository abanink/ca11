<component class="component-call-media" :class="classes('component')">
    <!-- local stream -->
    <MediaStream :stream="stream" v-if="stream.selected"/>

    <!-- remote streams -->
    <MediaStream :stream="stream" v-for="stream of selectedStreams"/>

</component>
