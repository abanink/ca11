<article
    component
    class="media-stream"
    :class="classes()"
    @click="toggleSelect"
>

    <slot name="single-action"></slot>
    <icon class="media-stream-icon" :name="stream.kind"/>
    <audio :class="{hidden: !(stream.kind === 'audio')}"
        autoplay="true"
        :muted="stream.muted || stream.kind !== 'audio'"
        ref="audio"
    />
    <video :class="{hidden: stream.kind !== 'video'}"
        autoplay="true"
        :muted="stream.muted || stream.kind !== 'video'"
        ref="video"
    />
    <video :class="{hidden: stream.kind !== 'display'}"
        autoplay="true"
        :muted="stream.muted || stream.kind !== 'display'"
        ref="display"
    />

    <!-- <Soundmeter class="soundmeter" :stream="stream"/> -->
</article>
