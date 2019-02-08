const SipCaller = require('./sip')
const Sig11Caller = require('./sig11')


/**
* Main entrypoint for Calls.
* @memberof AppBackground.plugins
*/
class PluginCaller extends Plugin {
    /**
    * @param {AppBackground} app - The background application.
    */
    constructor(app) {
        super(app)

        // Keeps track  of calls. Keys match Sip.js session keys.
        this.calls = {}

        this.SipCall = require('./call/sip')
        this.Sig11Call = require('./call/sig11')
        // This flag indicates whether a reconnection attempt will be
        // made when the websocket connection is gone.

        this.app.sig11 = new Sig11Caller(this.app, this)
        this.sip = new SipCaller(this.app, this)

        this.reconnect = true
        // The default connection timeout to start with.
        this.retryDefault = {interval: 250, limit: 10000, timeout: 250}
        // Used to store retry state.
        this.retry = Object.assign({}, this.retryDefault)

        /**
         * Accept an incoming Call.
         * @event module:ModuleCalls#caller:call-accept
         * @property {callId} callId - Id of the Call object to accept.
         */
        this.app.on('caller:call-accept', ({callId}) => this.calls[callId].accept())
        /**
         * Set this Call to be the visible Call.
         * @event caller:call-activate
         * @property {callId} callId - Id of the Call object to activate.
         * @property {Boolean} holdInactive - Whether to hold the other Calls.
         * @property {Boolean} unholdActive - Whether to unhold the activated Call.
         */
        this.app.on('caller:call-activate', ({callId, holdInactive, unholdActive}) => {
            let call = null
            if (callId) call = this.calls[callId]
            this.activateCall(call, holdInactive, unholdActive)
        })

        /**
        * Create - and optionally start - a new Call. This is the main
        * event used to start a call with.
        * @event module:ModuleCaller#caller:call-add
        *  @property {Object} description - Information about the new Call.
        * @property {String} [description.endpoint] - The endpoint to call.
        * @property {String} [description.start] - Start calling right away or just create a Call instance.
        */
        this.app.on('caller:call-add', ({callback, description, start}) => {
            // Sanitize the number.
            if (this.app.state.caller.description.protocol === 'sip') {
                description.endpoint = this.app.utils.sanitizeNumber(description.endpoint)
            }

            // Deal with a blind transfer Call.
            let activeOngoingCall = this.findCall({active: true, ongoing: true})
            if (activeOngoingCall && activeOngoingCall.state.transfer.active && activeOngoingCall.state.transfer.type === 'blind') {
                // Directly transfer the number to the currently activated
                // call when the active call has blind transfer mode set.
                activeOngoingCall.transfer(description.endpoint)
            } else {
                // Both a 'regular' new call and an attended transfer call will
                // create or get a new Call and activate it.
                description.type = 'outgoing'
                let call = this._newCall(description)

                call.start()

                // Sync the others transfer state of other calls to the new situation.
                this.__setTransferState()
                // A newly created call is always activated unless
                // there is another call already ringing.
                if (!Object.keys(this.calls).find((i) => ['create', 'invite'].includes(this.calls[i].state.status))) {
                    this.activateCall(call, true, true)
                }

                if (callback) callback({call: call.state})
            }
        })


        /**
        * Terminate/Hangup an active Call.
        * @event module:ModuleCalls#caller:call-terminate
        * @property {callId} callId - Id of the Call to delete.
        */
        this.app.on('caller:call-terminate', ({callId}) => {
            let status = 'bye'
            if (this.calls[callId].state.status === 'invite') {
                status = 'callee_busy'
            }
            // Use SIG11 parameters. SIP terminate doesn't have any atm.
            this.calls[callId].terminate({remote: true, status})
        })

        this.app.on('caller:call-hold', ({callId}) => {
            const call = this.calls[callId]
            if (!call.state.hold.active) {
                call.hold()
            } else {
                // Unhold while the call's transfer is active must also
                // undo the previously set transfer state on this call and
                // on others.
                if (call.state.transfer.active) {
                    // Unset the transfer state when it was active during an unhold.
                    this.__setTransferState(call, !call.state.transfer.active)
                }
                this.activateCall(call, true, true)
            }
        })


        /**
        * Toggle mute status on the call by manupilating the rtp
        * sender track of the Call.
        * @event module:ModuleCalls#caller:call-mute
        * @property {callId} callId - Id of the Call to toggle mute for.
        */
        this.app.on('caller:call-mute', ({callId}) => {
            const call = this.calls[callId]
            const rtpSenderTrack = call.pc.getSenders()[0].track

            if (!call.state.mute.active) {
                call.setState({mute: {active: true}})
                rtpSenderTrack.enabled = false
            } else {
                call.setState({mute: {active: false}})
                rtpSenderTrack.enabled = true
            }
        })


        /**
        * Finalizes an attended transfer.
        * @event module:ModuleCalls#caller:transfer-finalize
        * @property {callId} callId - Id of the Call to transfer to.
        */
        this.app.on('caller:transfer-finalize', ({callId}) => {
            // Find origin.
            let sourceCall
            for (const _callId of Object.keys(this.calls)) {
                if (this.calls[_callId].state.transfer.active) {
                    sourceCall = this.calls[_callId]
                }
            }
            sourceCall.transfer(this.calls[callId])
        })


        /**
         * Toggle hold for the call that needs to be transferred. Set
         * transfer mode to active for this call.
         * @event module:ModuleCalls#caller:transfer-initialize
         * @property {callId} callId - Id of the Call to toggle transfer mode for.
         */
        this.app.on('caller:transfer-initialize', ({callId}) => {
            const sourceCall = this.calls[callId]
            this.__setTransferState(sourceCall, !sourceCall.state.transfer.active)
        })
    }

    /**
    * Set the transfer state of a source call and update the transfer state of
    * other calls. This method doesn't change the intended transfer status
    * when no source Call is passed along. It just update outdated call state
    * in that case.
    * @param {Call} [sourceCall] - The call to update the calls status for.
    * @param {Boolean} active - The transfer status to switch or update to.
    */
    __setTransferState(sourceCall = {id: null}, active) {
        const callIds = Object.keys(this.calls)
        // Look for an active transfer call when the source call isn't
        // passed as a parameter.
        if (!sourceCall.id) {
            for (let _callId of callIds) {
                if (this.calls[_callId].state.transfer.active) {
                    sourceCall = this.calls[_callId]
                    // In this case we are not toggling the active status;
                    // just updating the status of other calls.
                    active = true
                    break
                }
            }
        }

        // Still no sourceCall. There is no transfer active at the moment.
        // Force all calls to deactivate their transfer.
        if (!sourceCall.id) active = false

        if (active) {
            // Enable transfer mode.
            if (sourceCall.id) {
                // Always disable the keypad, set the sourceCall on-hold and
                // switch to the default `attended` mode when activating
                // transfer mode on a call.
                sourceCall.setState({keypad: {active: false, number: ''}, transfer: {active: true, type: 'attended'}})
                sourceCall.hold()
            }
            // Set attended status on other calls.
            for (let _callId of callIds) {
                const _call = this.calls[_callId]
                if (_callId !== sourceCall.id) {
                    _call.setState({transfer: {active: false, type: 'accept'}})
                    // Hold all other ongoing calls.
                    if (!['new', 'create', 'invite'].includes(_call.state.status) && !_call.state.hold) {
                        _call.hold()
                    }
                }
            }
        } else {
            // Disable transfer mode.
            if (sourceCall.id) {
                sourceCall.setState({transfer: {active: false, type: 'attended'}})
                sourceCall.unhold()
            }
            // Set the correct state of all other calls; se the transfer
            // type to accept and disable transfer modus..
            for (let _callId of callIds) {
                const _call = this.calls[_callId]
                if (_callId !== sourceCall.id) {
                    this.calls[_callId].setState({transfer: {active: false, type: null}})
                    // Make sure all other ongoing calls stay on hold.
                    if (!['new', 'create', 'invite'].includes(_call.state.status) && !_call.state.hold) {
                        _call.hold()
                    }
                }
            }
        }
    }


    /**
    * Initializes the module's store.
    * @returns {Object} The module's store properties.
    */
    _initialState() {
        return {
            calls: {},
            description: {
                endpoint: '',
                protocol: 'sig11',
                status: 'new',
                video: true,
            },
        }
    }


    /**
    * Create and return a new `Call` object based on a
    * call description.
    * @param {Object} description - New call object.
    * @param {String} [description.endpoint] - Endpoint to call to.
    * @param {String} [description.protocol] - Protocol to use.
    * @returns {Call} - A new or existing Call with status `new`.
    */
    _newCall(description = null) {
        let call
        if (description.protocol === 'sip') {
            call = new this.SipCall(this.app, description)
        } else if (description.protocol === 'sig11') {
            const node = this.app.sig11.network.node(description.endpoint)

            call = new this.Sig11Call(this.app, {node, type: 'outgoing'})
        } else {
            throw new Error('invalid call type:', description.type)
        }


        this.calls[call.id] = call
        call.state.endpoint = description.endpoint
        call.setState(call.state)

        if (!this.app.state.caller.calls[call.id]) {
            Vue.set(this.app.state.caller.calls, call.id, call.state)
        }

        this.app.logger.info(`${this}created new ${call.constructor.name} call`)
        return call
    }


    _ready() {
        if (!this.app.state.app.online) {
            this.app.setState({calls: {status: null}})
        }
    }


    /**
    * Restore stored state from localStorage.
    * @param {Object} moduleStore - Root property for this module.
    */
    _restoreState(moduleStore) {
        this.app._mergeDeep(moduleStore, {
            calls: {},
            sig11: {
                status: 'loading',
            },
            sip: {
                status: 'loading',
            },
        })
    }


    /**
    * Delegate call-related actions.
    * @returns {Object} - Properties that need to be watched.
    */
    _watchers() {
        return {
            /**
            * Modify the menubar event icon when there is
            * no more ongoing call.
            */
            'store.caller.calls': () => {
                const ongoingCall = this.findCall({ongoing: true})
                if (!ongoingCall && ['calling', 'ringing'].includes(this.app.state.ui.menubar.event)) {
                    this.app.setState({ui: {menubar: {event: null}}})
                }
            },
        }
    }


    /**
    * Set the active state on the target call, un-hold the call and
    * put all other calls on-hold.
    * @param {Call} [call] - A Call to activate.
    * @param {Boolean} [holdOthers] - Unhold the call on activation.
    * @param {Boolean} [unholdOwn] - Unhold the call on activation.
    * @returns {Call|Boolean} - The Call or false.
    */
    activateCall(call, holdOthers = true, unholdOwn = false) {
        const callIds = Object.keys(this.calls)

        if (!call) {
            // Deactivate all calls.
            for (const callId of callIds) {
                let _call = this.calls[callId]
                _call.setState({active: false})
            }
        }

        for (const callId of Object.keys(this.calls)) {
            let _call = this.calls[callId]
            // A call that is closing. Don't bother changing hold
            // and active state properties.
            if (call && call.id === callId) {
                call.setState({active: true})
                // Only unhold calls that are in the right state.
                if (unholdOwn && _call.state.status === 'accepted') {
                    _call.unhold()
                }
            } else {
                _call.setState({active: false})
                // Only hold calls that are in the right state.
                if (holdOthers && _call.state.status === 'accepted') {
                    _call.hold()
                }
            }
        }

        return call
    }


    /**
    * A loosely coupled Call action handler. Operates on all current Calls.
    * Supported actions are:
    *   `accept-new`: Accepts an incoming call or switch to the new call dialog.
    *   `deline-hangup`: Declines an incoming call or an active call.
    *   `hold-active`: Toggle hold on the active call.
    * @param {String} action - The action; `accept-new` or `decline`.
    */
    callAction(action) {
        let inviteCall = null

        for (const callId of Object.keys(this.calls)) {
            // Don't select a call that is already closing
            if (this.calls[callId].state.status === 'invite') {
                inviteCall = this.calls[callId]
            }
        }

        const callActive = this.findCall({active: true, ongoing: true})

        if (action === 'action-accept-hangup') {
            if (inviteCall) inviteCall.accept()
            else if (callActive) callActive.terminate()
        } else if (action === 'action-decline-new') {
            if (inviteCall) inviteCall.terminate()
            else if (callActive) {
                const call = this._newCall()
                this.activateCall(call, true)
                this.app.setState({ui: {layer: 'caller'}})
            }
        } else if (action === 'action-hold-active') {
            // Make sure the action isn't provoked on a closing call.
            if (callActive) {
                if (callActive.state.hold.active) callActive.unhold()
                else callActive.hold()
            }
        }
    }


    /**
    * Take care of cleaning up an ending call.
    * @param {Call} call - The call object to remove.
    */
    deleteCall(call) {
        // This call is being cleaned up; move to a different call
        // when this call was the active call.
        if (call.state.active) {
            let newcallActive = null
            let fallbackCall = null
            for (const callId of Object.keys(this.calls)) {
                // We are not going to activate the Call we are deleting.
                if (callId === call.id) continue

                // Prefer not to switch to a call that is already closing.
                if (['answered_elsewhere', 'bye', 'request_terminated', 'callee_busy'].includes(this.calls[callId].state.status)) {
                    // The fallback Call is a non-specific closing call.
                    if (this.calls[callId]) fallbackCall = this.calls[callId]
                } else {
                    newcallActive = this.calls[callId]
                    break
                }
            }

            // Select the first closing Call when all Calls are closing.
            if (newcallActive) this.activateCall(newcallActive, true, false)
            else if (fallbackCall) this.activateCall(fallbackCall, true, false)
        }

        // Finally delete the call and its references.
        this.app.logger.debug(`${this}delete call ${call.id}`)
        // Vue.delete(this.app.state.caller.calls, call.id)
        const path = `caller.calls.${call.id}`
        this.app.setState(null, {action: 'delete', path})
        delete this.calls[call.id]
    }


    /**
    * @param {Object} options - Options to pass.
    * @param {Boolean} [options.ongoing] - Find the first Call that is going on.
    * @returns {Call|null} - the current active ongoing call or null.
    */
    findCall({active = false, ongoing = false} = {}) {
        let matchedCall = null
        for (const callId of Object.keys(this.calls)) {
            // Don't select a call that is already closing.
            if (active) {
                if (this.calls[callId].state.active) {
                    if (ongoing) {
                        if (this.calls[callId].state.status === 'accepted') matchedCall = this.calls[callId]
                    } else {
                        matchedCall = this.calls[callId]
                    }
                }
            } else {
                if (ongoing) {
                    if (this.calls[callId].state.status === 'accepted') matchedCall = this.calls[callId]
                }
            }
        }
        return matchedCall
    }


    /**
    * Generate a representational name for this module. Used for logging.
    * @returns {String} - An identifier for this module.
    */
    toString() {
        return `${this.app}[caller] `
    }
}

module.exports = PluginCaller
