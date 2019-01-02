<component class="c-media-preview content__header header" :class="classes('component')">
    <icon class="header__icon" name="call-active"/>

    <div class="streams-container">
        <MediaStream
            v-for="stream of Object.values(call.streams)"
            :class="{selected: stream.selected}"
            :stream="stream"
        />
    </div>
</component>
