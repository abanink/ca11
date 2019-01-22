<transition name="tr-stream">
<article
    component
    class="media-stream"
    :class="classes()"
    @click="$emit('click', $event)"
>
    <icon class="media-stream-icon" :name="stream.kind"/>

    <div v-if="!stream.ready" class="content">
        <icon name="spinner" class="spinner media-stream__loading" />
    </div>

    <audio
        v-if="stream.id && stream.kind === 'audio'"
        autoplay="true"
        muted="true"
        ref="audio"
    />

    <video
        v-else-if="stream.id && stream.kind === 'video'"
        autoplay="true"
        :muted="stream.muted || stream.kind !== 'video'"
        ref="video"
    />

    <video
        v-else-if="stream.id && stream.kind === 'display'"
        autoplay="true"
        :muted="stream.muted || stream.kind !== 'display'"
        ref="display"
    />

    <div v-if="stream.ready && controls" class="media-stream__controls">
        <icon name="fullscreen" @click.stop="toggleFullscreen()"/>
        <icon name="pip" :class="{active: recording}" @click.stop="togglePip()"/>
        <icon name="record-rec" :class="{active: recording}" @click.stop="toggleRecord()"/>
        <icon v-if="stream.local" :name="stream.kind" @click.stop="switchStream()"/>
    </div>
</article>
</transition>
