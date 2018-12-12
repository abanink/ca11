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

        // Create audio/video elements in a browser-like environment.
        // The audio element is used to playback sounds with
        // (like ringtones, dtmftones). The video element is
        // used to attach the remote WebRTC stream to.

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
    _getUserMediaFlags() {
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
                video: this.app.state.calls.description.video,
            },
            AUDIO_PROCESSING: {
                audio: {},
                video: this.app.state.calls.description.video,
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
        this.intervalId = setInterval(async() => {
            // Only do this when being authenticated; e.g. when there
            // is an active state container around.
            if (this.app.state.user.authenticated) {
                try {
                    await this.query()
                    if (this.app.env.section.bg && !this.app.devices.cached) {
                        await this.app.devices.verifySinks()
                    }
                    // Disable this poller as soon we got permission.
                    if (this.app.state.settings.webrtc.media.permission) {
                        clearInterval(this.intervalId)
                    }
                } catch (err) {
                    console.error(err)
                    // An exception means something else than a lack of permission.
                    clearInterval(this.intervalId)
                }
            }
        }, 500)
    }


    /**
    * Silently try to initialize media access, unless the error is not
    * related to a lack of permission.
    */
    async query() {
        // Check media permission at the start of the bg/fg.
        if (this.app.env.isNode) {
            this.app.setState({settings: {webrtc: {media: {permission: false}}}})
            return
        }

        try {
            await navigator.mediaDevices.getUserMedia(this._getUserMediaFlags())
            this.app.emit('local-stream-ready')

            // Share streams between bg and fg when in the same context.
            if (this.app.env.section.fg && !this.app.env.isExtension) {
                this.app.apps.bg.media.streams = this.streams
            }
            if (!this.app.state.settings.webrtc.media.permission) {
                this.app.setState({settings: {webrtc: {media: {permission: true}}}})
            }
        } catch (err) {
            console.log(err)
            // There are no devices at all. Spawn a warning.
            if (err.message === 'Requested device not found') {
                if (this.app.env.section.fg) {
                    this.app.notify({icon: 'warning', message: this.app.$t('no audio devices found.'), type: 'warning'})
                }
                throw new Error(err)
            }

            // This error also may be triggered when there are no devices
            // at all. The browser sometimes has issues finding any devices.
            if (this.app.state.settings.webrtc.media.permission) {
                this.app.setState({settings: {webrtc: {media: {permission: false}}}})
            }
        }
    }
}

module.exports = Media
