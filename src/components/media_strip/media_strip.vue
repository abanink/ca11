<component class="media-strip">
     <!-- Call information during a call. Hide when the keypad takes too muchs space. -->
     <template v-if="call && call.streams">

    <MediaStream :stream="stream" v-for="stream of Object.values(call.streams)"/>
    </template>

</component>
