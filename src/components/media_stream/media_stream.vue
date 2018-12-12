<component class="component-media-stream">
    <audio v-if="stream.kind === 'audio'" autoplay="true" :id="`video-${stream.id}`" :ref="`stream-${stream.id}`"></audio>
    <video v-if="stream.kind === 'video'" autoplay="true" :id="`video-${stream.id}`" :ref="`stream-${stream.id}`"></video>
</component>
