/**
* UserMedia related class that interacts with Ca11
* and the getUserMedia API. The `getUserMedia` call with
* WebExtensions is rather cumbersome. The background script
* can only check the permission, while the foreground script
* triggers an actual request to the user to modify the
* permission. The browser UI status is updated after every
* call to getUserMedia, that's why we use a poller here to
* keep the media status up-to-date.
*/
class Media {

    constructor(app) {
        this.app = app

        // Plays audio when no video can be shown due to an
        // absent foreground DOM.
        this.fallback = {local: null, remote: null}
        this.streams = {}

        if (!this.app.env.isBrowser) return

        if (this.app.env.isExtension) {
            this.__createFallbackMedia()
        } else {
            if (this.app.env.section.bg) {
                this.__createFallbackMedia()
            } else {
                this.fallback.local = document.querySelector('video#local')
                this.fallback.remote = document.querySelector('video#remote')
            }
        }

        document.body.prepend(this.fallback.local)
        document.body.prepend(this.fallback.remote)
    }


    __createFallbackMedia() {
        this.fallback.local = document.createElement('video')
        this.fallback.local.setAttribute('id', 'local')
        this.fallback.local.muted = true

        this.fallback.remote = document.createElement('video')
        this.fallback.remote.setAttribute('id', 'remote')

        // Trigger play automatically. This is required for any audio
        // to play during a call.
        this.fallback.local.addEventListener('canplay', () => this.fallback.local.play())
        this.fallback.remote.addEventListener('canplay', () => this.fallback.remote.play())
    }


    /**
    * Return the getUserMedia flags based on the user's settings.
    * @returns {Object} - Supported flags for getUserMedia.
    */
    _getUserMediaFlags({audio = true, video = true} = {}) {
        const presets = {
            AUDIO_NOPROCESSING: {
                audio: {
                    echoCancellation: false,
                    googAudioMirroring: false,
                    googAutoGainControl: false,
                    googAutoGainControl2: false,
                    googEchoCancellation: false,
                    googHighpassFilter: false,
                    googNoiseSuppression: false,
                    googTypingNoiseDetection: false,
                },
                video,
            },
            AUDIO_PROCESSING: {
                audio: {},
                video,
            },
        }

        const userMediaFlags = presets[this.app.state.settings.webrtc.media.type.selected.id]
        const inputSink = this.app.state.settings.webrtc.devices.sinks.headsetInput.id

        if (inputSink && inputSink !== 'default') {
            userMediaFlags.audio.deviceId = inputSink
        }
        return userMediaFlags
    }


    /**
    * The getUserMedia permission change doesn't have an event. Instead, the
    * media devices are queried by this poller for every x ms. This is done in
    * the foreground to keep the permission UI in-line and up-to-date. The
    * background uses the same poller to update some properties on a permission
    * change - like the device list - regardless whether the UI is shown.
    * 500 ms should be a right balance between responsiveness and a slight
    * performance loss.
    */
    poll() {
        this.app.logger.debug(`${this}media poller started`)
        this.intervalId = setInterval(async() => {
            // Only do this when being authenticated; e.g. when there
            // is an active state container around.
            if (this.app.state.user.authenticated) {
                try {
                    const stream = await this.query()
                    if (this.app.env.section.bg && !this.app.devices.cached) {
                        await this.app.devices.verifySinks()
                    }
                    // Disable this poller as soon we got permission.
                    if (stream) {
                        this.app.logger.debug(`${this}media poller stopped (approved)`)
                        clearInterval(this.intervalId)
                    }
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(err)
                    this.app.logger.debug(`${this}media poller stopped (exception: ${err})`)
                    // An exception means something else than a lack of permission.
                    clearInterval(this.intervalId)
                }
            }
        }, 500)
    }


    /**
    * Query for an audio, video or display stream.
    * @param {String} type - The type of media to acquire.
    * @returns {MediaStream} - When succesfully requested a stream; null otherwise.
    */
    async query(type = null) {
        if (this.app.env.isNode) return null
        if (!type) type = this.app.state.settings.webrtc.media.stream.type

        const streamId = this.app.state.settings.webrtc.media.stream[type].id
        // Reuse an existing stream.
        let stream = this.streams[streamId]

        if (!stream) {
            try {
                const flags = this._getUserMediaFlags({audio: true, video: type === 'video' ? true : false})
                const userMedia = await navigator.mediaDevices.getUserMedia(flags)

                if (type === 'display') {
                    // getDisplayMedia in Chrome doesn't support audio yet; add the audiotrack from
                    // userMedia to the MediaStream so Asterisk won't panic.
                    let audio = await userMedia.getAudioTracks()[0]
                    stream = await navigator.getDisplayMedia({audio: false, video: true})
                    for (const track of stream.getTracks()) {
                        track.onended = (e) => {
                            const stateStream = {display: {id: null}}
                            // Unset the stream id.
                            this.app.setState({settings: {webrtc: {media: {stream: stateStream}}}})

                            // Switch to audio type when the display stream is current selected.
                            type = this.app.state.settings.webrtc.media.stream.type
                            if (type === 'display') this.query('audio')
                        }
                    }

                    stream.addTrack(audio)
                } else {
                    stream = userMedia
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err)
                // There are no devices at all. Spawn a warning.
                if (err.message === 'Requested device not found') {
                    if (this.app.env.section.fg) {
                        this.app.notify({icon: 'warning', message: this.app.$t('no audio devices found.'), type: 'warning'})
                    }
                    throw new Error(err)
                }

                // This error also may be triggered when there are no devices
                // at all. The browser sometimes has issues finding any devices.
                this.app.setState({settings: {webrtc: {media: {permission: false}}}})
            }
        }

        if (!stream) return null

        this.streams[stream.id] = stream
        // Share streams between bg and fg when in the same context.
        if (this.app.env.section.fg && !this.app.env.isExtension) {
            this.app.apps.bg.media.streams = this.streams
        }

        // The local stream is not part of a particular call.
        // That is why it is kept apart from the other streams.
        const media = {
            permission: true,
            stream: {
                type,
                [type]: {
                    muted: true,
                    selected: false,
                    visible: true,
                },
            },
        }

        this.app.setState({settings: {webrtc: {media}}}, {persist: true})
        // (!) The stream id is never persisted; there is stream
        // initialization logic that relies on the absence of the id.
        this.app.setState({settings: {webrtc: {media: {stream: {[type]: {id: stream.id}}}}}})
        return stream
    }


    stop() {
        for (const [streamId, stream] of Object.entries(this.streams)) {
            for (const track of stream.getTracks()) {
                track.stop()
            }
            delete this.streams[streamId]
        }
    }


    /**
    * Representats this Class name in logging.
    * @returns {String} - The identifier to use.
    */
    toString() {
        return '[bg] [media] '
    }
}

module.exports = Media
