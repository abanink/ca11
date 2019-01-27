module.exports = (app) => {
    let recorder, recorderData, types
    // Android crashes at the moment on getDisplayMedia.
    if (app.env.isAndroid) types = ['audio', 'video']
    else types = ['audio', 'video', 'display']

    /**
    * @memberof fg.components
    */
    const Stream = {
        data: function() {
            return {
                recording: false,
            }
        },
        methods: {
            classes: function(block) {
                const classes = {
                    [this.stream.kind]: true,
                    selected: this.stream.selected,
                }

                classes['no-progress'] = (!this.progress && !this.stream.ready)

                if (this.stream.ready) classes[`t-btn-media-stream-${this.stream.kind}`] = true
                return classes
            },
            switchStream: function() {
                // Step through streamTypes.
                const nextStreamType = types[(types.indexOf(this.stream.kind) + 1) % types.length]
                // Maintain selected state between streams.
                app.media.query(nextStreamType, {selected: this.stream.selected})
            },
            toggleFullscreen: function() {
                const mediaElement = this.$refs[this.stream.kind]
                mediaElement.requestFullscreen({navigationUI: 'hide'})
            },
            togglePip: function() {
                const mediaElement = this.$refs[this.stream.kind]
                mediaElement.requestPictureInPicture()
            },
            toggleRecord: function() {
                if (!this.recording) {
                    this.recording = true
                    recorder = new MediaRecorder(app.media.streams[this.stream.id])
                    recorderData = []
                    recorder.ondataavailable = (event) => {
                        recorderData.push(event.data)
                    }

                    recorder.onstop = function(e) {
                        let recordedBlob = new Blob(recorderData)
                        var audioURL = URL.createObjectURL(recordedBlob)
                        var link = document.createElement('a')
                        link.setAttribute('href', audioURL)
                        link.setAttribute('download', 'recording.webm')
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                    }
                    recorder.start()
                } else {
                    recorder.stop()
                    this.recording = false
                }

            },
        },
        mounted: function() {
            if (this.stream.id) {
                Vue.nextTick(() => {
                    const mediaElement = this.$refs[this.stream.kind]
                    mediaElement.srcObject = app.media.streams[this.stream.id]

                    if (this.stream.muted) mediaElement.muted = true

                    mediaElement.addEventListener('loadeddata', () => {
                        this.stream.ready = true
                    })
                })
            }
        },
        props: {
            controls: {
                default: true,
                type: Boolean,
            },
            progress: {
                default: true,
                type: Boolean,
            },
            stream: {
                default: null,
                type: Object,
            },
        },
        render: templates.stream.r,
        staticRenderFns: templates.stream.s,
        watch: {
            'stream.id': function(streamId) {
                Vue.nextTick(() => {
                    const mediaElement = this.$refs[this.stream.kind]
                    mediaElement.srcObject = app.media.streams[streamId]
                    if (this.stream.muted) mediaElement.muted = true

                    mediaElement.addEventListener('loadeddata', () => {
                        this.stream.ready = true
                    })
                })

            },
        },
    }

    return Stream
}
