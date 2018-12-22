<component class="media-stream media-container"
    :class="classes('component')"
    @click="toggleSelect"
>
    <div class="audio-container content" :class="{hidden: !(stream.kind === 'audio')}">
        <icon name="mic"/>
        <audio
            autoplay="true"
            :muted="stream.muted || stream.kind !== 'audio'"
            ref="audio"
        />
    </div>

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


    <slot name="actions"></slot>
</component>
