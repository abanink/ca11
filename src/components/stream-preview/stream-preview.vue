<component class="c-stream-preview content__header" :class="classes('component')">
    <icon class="header__icon" name="call-active"/>

    <div class="streams-container">
        <Stream
            v-for="stream of Object.values(call.streams)"
            :key="Object.values(call.streams).indexOf(stream)"
            :class="{selected: stream.selected}"
            :controls="false"
            :progress="false"
            :stream="stream"
            @click="toggleSelect(stream)"
        />
    </div>
</component>
