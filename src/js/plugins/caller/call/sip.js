/**
* @module ModuleCalls
*/
const Call = require('./index')

/**
* Call implementation for incoming and outgoing calls
* using WebRTC and SIP.js.
*/
class CallSIP extends Call {
    /**
    * @param {AppBackground} app - The background application.
    * @param {Object} [description] - SIP call description.
    * @param {Boolean} [options.active] - Activates this Call in the UI.
    * @param {Boolean} [options.silent] - Setup a Call without interfering with the UI.
    */
    constructor(app, description) {
        super(app, description)
        this.state.protocol = 'sip'

        // Created from an invite means that the session is
        // already there, e.g. this is an incoming call.
        if (description.session) {
            // Passing in a session as target means an incoming call.
            app._mergeDeep(this.state, {
                status: 'invite',
                type: 'incoming',
            })
            this.session = description.session
        } else {
            // Passing in no target or a number means an outgoing call.
            app._mergeDeep(this.state, {
                endpoint: description.endpoint,
                status: 'new', type: 'outgoing',
            })
        }
    }


    /**
    * Handle an incoming `invite` call from.
    */
    _incoming() {
        this.state.endpoint = this.session.assertedIdentity.uri.user
        this.state.displayName = this.session.assertedIdentity.uri.user

        this.state.stats.callId = this.session.request.call_id
        this.app.logger.debug(`${this}incoming call ${this.state.stats.callId} started`)
        super._incoming()

        // Setup some event handlers for the different stages of a call.
        this.session.on('accepted', (request) => {
            this._start({message: this.translations.accepted.incoming})
        })

        this.session.on('bye', (e) => {
            if (e.getHeader('X-Asterisk-Hangupcausecode') === '58') {
                this.app.notify({
                    icon: 'warning',
                    message: this.app.$t('code 58: PBX AVPF/encryption issue'),
                    type: 'warning',
                })
            }

            this.setState({status: 'bye'})
            this._stop({message: this.translations[this.state.status]})
        })

        /**
        * The `failed` status is triggered when a call is rejected, but
        * also when an incoming calls keeps ringing for a certain amount
        * of time (60 seconds), and fails due to a timeout. In that case,
        * no `rejected` event is triggered and we need to kill the
        * call ASAP, so a new INVITE for the same call will be accepted by the
        * call module's invite handler.
        */
        this.session.on('failed', (message) => {
            if (typeof message === 'string') message = SIP.Parser.parseMessage(message, this.plugin.sip.ua)
            let reason = message.getHeader('Reason')
            if (reason) {
                reason = this._parseHeader(reason).get('text')
            }

            if (reason === 'Call completed elsewhere') {
                this.app.logger.info(`${this}call completed elsewhere: ${this.state.stats.callId}`)
                this.setState({status: 'answered_elsewhere'})
            } else {
                this.app.logger.info(`${this}call rejected: ${this.state.stats.callId}`)
                // `Call completed elsewhere` is not considered to be
                // a missed call and will not end up in the activity log.
                this.app.emit('caller:call-rejected', {call: this.state}, true)
                // We could distinguish here between a CANCEL send by the calling
                // party, or a cancel made by the callee. For now let's use
                // `request_terminated` for both cases.
                if (message.method === 'CANCEL') {
                    this.setState({status: 'request_terminated'})
                } else if (message.status_code === 480) {
                    // The accepting party terminated the incoming call.
                    this.setState({status: 'request_terminated'})
                }
            }


            this._stop({message: this.translations[this.state.status]})
        })

        this.session.on('reinvite', (session, request) => {
            // Seems to be a timing issue in SIP.js. After a transfer,
            // the old name is keps in assertedIdentity, unless a timeout
            // is added.
            setTimeout(() => {
                this.state.displayName = session.assertedIdentity.uri.user
                this.state.endpoint = session.assertedIdentity.uri.user
            }, 0)
        })
    }


    /**
     * Asterisk always returns only one (mixed) audio
     * track; and one or more video tracks, depending
     * on whether video contraints requested video.
     * The audio track is grouped with the first available
     * video track.
     * @param {RTCTrackEvent} e - Contains the added track from RTCPeerConnection.
     */
    _onTrackAdded(e) {
        let stream = e.streams[0]

        // Assume the audio track of the stream is always added first.
        // There is only one audio track in each call. Add this track
        // to all video tracks.
        if (e.track.kind === 'audio') {
            this.audiostream = stream
            // The video track from Asterisk sharing the same stream id
            // as the audio is not an active video stream and should
            // not be added to the scene.
            stream.getVideoTracks().forEach((t) => {
                stream.removeTrack(t)
            })

            this.addStream(stream, 'audio')
        } else {
            if (this.audiostream.id !== stream.id) {
                this.addStream(stream, 'video')
            }
        }

        const path = `caller.calls.${this.id}.streams.${stream.id}`
        e.track.onunmute = () => {this.app.setState({muted: false}, {path})}
        e.track.onmute = () => {this.app.setState({muted: true}, {path})}
        e.track.onended = () => {this._cleanupStream(stream.id)}
    }


    /**
    * Setup an outgoing call.
    */
    _outgoing() {
        super._outgoing()
        const uri = `sip:${this.state.endpoint}@${this.app.state.sip.endpoint.split('/')[0]}`
        this.session = this.app.sip.ua.invite(uri, {
            sessionDescriptionHandlerOptions: {
                constraints: this.app.media._getUserMediaFlags(),
            },
        })

        this.setState({stats: {callId: this.session.request.call_id}})
        // Handle connecting streams to the appropriate video element.
        this.session.on('track', this._onTrackAdded.bind(this))

        // Notify user about the new call being setup.
        this.session.on('accepted', (data) => {
            this._start({message: this.translations.accepted.outgoing})
        })

        // Reset call state when the other halve hangs up.
        this.session.on('bye', (e) => {
            this.setState({status: 'bye'})
            this._stop({message: this.translations[this.state.status]})
        })


        /**
        * Play a ringback tone on the following status codes:
        * 180: Ringing
        * 181: Call is Being Forwarded
        * 182: Queued
        * 183: Session in Progress
        */
        this.session.on('progress', (e) => {
            if ([180, 181, 182, 183].includes(e.status_code)) {
                this.app.sounds.ringbackTone.play()
            }
        })


        // Blind transfer.
        this.session.on('refer', (target) => {
            this.session.bye()
        })

        // The user is being transferred; update the caller
        // info from the P-Asserted-Identity header.
        this.session.on('reinvite', (session) => {
            // Seems to be a timing issue in SIP.js. After a transfer,
            // the old name is keps in assertedIdentity, unless a timeout
            // is added.
            setTimeout(() => {
                if (session.assertedIdentity) {
                    this.state.displayName = session.assertedIdentity.uri.user
                    this.state.endpoint = session.assertedIdentity.uri.user
                } else {
                    this.state.displayName = session.remoteIdentity.uri.user
                    this.state.endpoint = session.remoteIdentity.uri.user
                }
            }, 0)
        })

        this.session.on('failed', (message) => {
            this.app.logger.info(`${this}call declined: ${message.status_code}/${this.state.stats.callId}`)

            if (message.status_code === 480) {
                // Temporarily Unavailable; Callee currently unavailable.
                this.setState({status: 'callee_unavailable'})
            } else if (message.status_code === 486) {
                // Busy here; Callee is busy.
                this.setState({status: 'callee_busy'})
            } else if (message.status_code === 487) {
                // Request terminated; Request has terminated by bye or cancel.
                this.setState({status: 'request_terminated'})
            } else {
                // Assume `request_terminated`, but log unhandled status as a warning.
                this.app.logger.warn(`${this}unhandled status code: ${message.status_code}`)
                this.setState({status: 'request_terminated'})
            }

            this.app.emit('caller:call-rejected', {call: this.state}, true)
            this._stop({message: this.translations[this.state.status]})
        })
    }


    /**
    * Convert a comma-separated string like:
    * `SIP;cause=200;text="Call completed elsewhere` to a Map.
    * @param {String} header - The header to parse.
    * @returns {Map} - A map of key/values of the header.
    */
    _parseHeader(header) {
        return new Map(header.replace(/\"/g, '').split(';').map((i) => i.split('=')))
    }


    /**
    * Accept an incoming session.
    */
    accept() {
        super.accept()
        // Handle connecting streams to the appropriate video element.
        this.session.on('track', this._onTrackAdded.bind(this))
        this.session.accept({
            sessionDescriptionHandlerOptions: {
                constraints: this.app.media._getUserMediaFlags(),
            },
        })
    }


    hold() {
        if (this.session) {
            this.session.hold({
                sessionDescriptionHandlerOptions: {
                    constraints: this.app.media._getUserMediaFlags(),
                },
            })
            this.setState({hold: {active: true}})
        }
    }


    /**
    * Terminate a Call depending on it's current status.
    */
    terminate() {
        if (this.state.status === 'new') {
            // An empty/new call; just delete the Call object without noise.
            this.app.plugins.caller.deleteCall(this)
            return
        } else if (this.state.status === 'create') {
            // A fresh outgoing Call; not yet started. There may or may not
            // be a session object. End the session if there is one.
            if (this.session) this.session.terminate()
            this.setState({status: 'request_terminated'})
            // The session's closing events will not be called, so manually
            // trigger the Call to stop here.
            this._stop()
        } else {
            // Calls with other statuses need some more work to end.
            try {
                if (this.state.status === 'invite') {
                    this.setState({status: 'request_terminated'})
                    this.session.reject() // Decline an incoming call.
                } else if (['accepted'].includes(this.state.status)) {
                    // Hangup a running call.
                    this.session.bye()
                    // Set the status here manually, because the bye event on the
                    // session is not triggered.
                    this.setState({status: 'bye'})
                }
            } catch (err) {
                this.app.logger.warn(`${this}unable to close the session properly. (${err})`)
                // Get rid of the Call anyway.
                this._stop()
            }
        }
    }


    /**
    * Generate a representational name for this module. Used for logging.
    * @returns {String} - An identifier for this module.
    */
    toString() {
        return `${this.app}[CallSIP][${this.id}] `
    }


    transfer(targetCall) {
        if (typeof targetCall === 'string') {
            this.session.refer(`sip:${targetCall}@ca11.io`)
        } else {
            this.session.refer(targetCall.session)
        }
    }


    unhold() {
        if (this.session) {
            this.session.unhold({
                sessionDescriptionHandlerOptions: {
                    constraints: this.app.media._getUserMediaFlags(),
                },
            })
            this.setState({hold: {active: false}})
        }
    }
}

module.exports = CallSIP
