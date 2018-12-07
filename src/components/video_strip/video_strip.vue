<component class="video-strip">
    <video ref="local-video" class="call-local-video"></video>
    <!-- Call information during a call. Hide when the keypad takes too muchs space. -->
    <template v-if="call">
    <video v-for="track of Object.keys(call.tracks.video)"
        ref="remote-video" class="call-remote-video"></video>

    </template>
</component>
