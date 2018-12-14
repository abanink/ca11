<component class="component-media-stream media-container"
    :class="classes('component')"
    @click="toggleSelect">

    <template v-if="stream.kind === 'audio'">
        <icon name="mic"/>
        <audio autoplay="true" :muted="stream.muted" :id="`video-${stream.id}`" :ref="`stream-${stream.id}`"></audio>
    </template>

    <template v-if="stream.kind === 'video'">
        <video v-if="stream.kind === 'video'" autoplay="true" :muted="stream.muted" :id="`video-${stream.id}`" :ref="`stream-${stream.id}`"></video>
    </template>
</component>
