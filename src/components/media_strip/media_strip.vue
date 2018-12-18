<component class="media-strip">
    <!-- The local stream -->
    <MediaStream v-if="stream.id" :stream="stream" class="local" />
    <div v-else class="media-container loading">
        <div class="content">
            <icon name="spinner" class="spinner"/>
        </div>
    </div>

     <!-- Call information during a call. Hide when the keypad takes too muchs space. -->
    <template v-if="call">
    <MediaStream
        v-for="stream of Object.values(call.streams)"
        :class="{selected: stream.selected}"
        :stream="stream"
    />
    </template>
</component>
