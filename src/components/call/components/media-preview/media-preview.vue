<component class="c-media-preview main-content-header" :class="classes('component')">
    <icon class="header-icon" name="phone"/>
    <MediaStream
        v-for="stream of Object.values(call.streams)"
        :class="{selected: stream.selected}"
        :stream="stream"
    />
</component>
