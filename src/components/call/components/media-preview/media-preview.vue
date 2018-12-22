<component class="media-preview" :class="classes('component')">
    <MediaStream
        v-for="stream of Object.values(call.streams)"
        :class="{selected: stream.selected}"
        :stream="stream"
    />
</component>
