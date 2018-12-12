<component class="component-media-stream">
    {{stream.muted}}
    <template v-if="stream.kind === 'audio'" class="container">
        <icon name="mic"/>
        <audio  autoplay="true" :id="`video-${stream.id}`" :ref="`stream-${stream.id}`"></audio>
    </template>

    <template v-if="stream.kind === 'video'" class="container">
        <video v-if="stream.kind === 'video'" autoplay="true" :id="`video-${stream.id}`" :ref="`stream-${stream.id}`"></video>
    </template>
</component>
