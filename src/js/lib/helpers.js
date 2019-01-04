/** @memberof lib */

/**
* Actions shared across components. Don't modify state
* local component state from here.
*/

/**
* Closure method that makes the app context available
* to all inner methods.
* @param {App} app - The application object.
* @returns {Object} - The application's common helpers.
* @memberof App
*/
function helpers(app) {

    const closingStatus = ['answered_elsewhere', 'request_terminated', 'callee_busy', 'bye']
    let _helpers = {}

    _helpers.callActive = function() {
        let callActive = this.description

        for (const id of Object.keys(this.calls)) {
            if (this.calls[id].active) callActive = this.calls[id]
        }

        return callActive
    }


    _helpers.callAccepted = function() {
        let accepted = false
        const calls = app.state.calls.calls

        for (const callId of Object.keys(calls)) {
            const status = calls[callId].status
            // An active Call is not a new Call, but may be a closing Call.
            if (status === 'accepted') accepted = true
        }

        return accepted
    }


    /**
    * Helper function to determine whether calling functionality
    * should be activated or not. Used both within and outside
    * of components.
    * @returns {Boolean} - Whether calling options are disabled.
    */
    _helpers.callingDisabled = function() {
        let errors = []

        if (!app.state.app.online) errors.push('offline')
        else {
            if (!app.state.settings.webrtc.media.permission) errors.push('mediaPermission')
            if (!(app.state.settings.webrtc.devices.ready)) errors.push('device')
        }

        if (!errors.length) return false
        else return errors
    }


    /**
    * Filter and return all ids of Calls that are
    * in a closing state.
    * @returns {Array} - Closing Call ids.
    */
    _helpers.callsClosing = function() {
        const calls = app.state.calls.calls
        return Object.keys(calls).filter((i) => closingStatus.includes(calls[i].status))
    }


    /**
    * An ongoing Call is a Call that is either ongoing or
    * in the process of being closed.
    * @returns {Boolean} - Whether one or more calls is active.
    */
    _helpers.callOngoing = function() {
        const calls = app.state.calls.calls
        const callIds = Object.keys(calls)

        for (const callId of callIds) {
            const status = calls[callId].status
            // An active Call is not a new Call, but may be a closing Call.
            if (status !== 'new') return true
        }

        return false
    }


    /**
    * Flag used to check whether some call actions can be shown.
    * This is done by checking if there are Calls that don't have
    * state `accepted` or `new`. In that case, the call action should
    * be disabled.
    * @returns {Boolean} - Whether
    */
    _helpers.callsReady = function() {
        let ready = true
        const callIds = Object.keys(app.state.calls.calls)
        for (let callId of callIds) {
            if (!['accepted', 'new'].includes(this.calls[callId].status)) {
                ready = false
            }
        }
        return ready
    }


    _helpers.getTranslations = function() {
        const $t = app.$t
        return {
            // Human translation to internal status codes.
            call: {
                accepted: {
                    hold: $t('on hold'),
                    incoming: $t('calling'),
                    outgoing: $t('calling'),
                },
                answered_elsewhere: $t('answered elsewhere'),
                bye: $t('call ended'),
                callee_busy: $t('callee is busy'),
                callee_unavailable: $t('callee is unavailable'),
                create: $t('setting up call'),
                dialing_a: $t('dialing phone A'),
                dialing_b: $t('dialing phone B'),
                invite: $t('incoming call'),
                request_terminated: $t('busy here'),
            },
            callingDisabled: {
                device: $t('audio device settings - invalid audio device').ca(),
                disconnected: $t('not connected to service').ca(), // Non-WebRTC status.
                mediaPermission: $t('microphone access denied').ca(),
                offline: $t('internet connection is offline').ca(),
                unregistered: $t('not registered at service').ca(),
            },
        }
    }

    /**
        * Find the contact related to a calling number.
        * @param {String} number - The number to look for.
        * @param {Boolean} partial - Return the first matching number.
        * @returns {Object|null} - Contact and Endpoint Id or null.
        */
    _helpers.matchContact = function(number, partial = false) {
        const contacts = app.state.contacts.contacts
        for (const contactId of Object.keys(contacts)) {
            for (const endpointId of Object.keys(contacts[contactId].endpoints)) {
                const endpoint = contacts[contactId].endpoints[endpointId]
                if (partial) {
                    if (String(endpoint.number).includes(number)) {
                        return {contact: contacts[contactId].id, endpoint: endpoint.id}
                    }
                } else {
                    if (String(endpoint.number) === number) return {contact: contacts[contactId].id, endpoint: endpoint.id}
                }
            }
        }

        return null
    }


    _helpers.openTab = function(url) {
        if (app.env.isExtension) browser.tabs.create({url})
        else window.open(url, '_blank')
    }


    _helpers.openWindow = function(windowParams = {}, center = true) {
        if (center) {
            windowParams.left = (screen.width / 2) - (windowParams.width / 2)
            windowParams.top = (screen.height / 2) - (windowParams.height / 2)
        }

        if (app.env.isExtension) browser.windows.create(windowParams)
        else {
            window.open(windowParams.url, '', Object.entries(windowParams).map((i) => i.join('=')).join(','))
            window.focus()
        }
    }

    _helpers.playSound = function(soundName, sinkTarget) {
        this.playing[sinkTarget] = true

        if (app.sounds[soundName].off) {
            // Prevent frenzy-clicking the test-audio button.
            if (app.sounds[soundName].playing) return

            app.sounds[soundName].play(false, this.devices.sinks[sinkTarget])
            app.sounds[soundName].off('stop').on('stop', () => {
                this.playing[sinkTarget] = false
            })
        } else {
            // Prevent frenzy-clicking the test-audio button.
            if (app.sounds[soundName].started) return

            app.sounds[soundName].play(this.devices.sinks[sinkTarget])
            setTimeout(() => {
                app.sounds[soundName].stop()
                this.playing[sinkTarget] = false
            }, 2500)
        }
    }


    // Allow plugins to add their own shared methods. These
    // must be added before components are setting their
    // methods.
    _helpers.sharedMethodsMixin = {}

    _helpers.sharedMethods = function() {
        return Object.assign({
            closeOverlay: function() {
                app.setState({ui: {overlay: null}})
            },
            getTranslations: _helpers.getTranslations,
            isTransferTarget: function(contact, number) {
                let numbers = []
                const calls = this.$store.calls.calls
                for (let callId of Object.keys(calls)) {
                    numbers.push(parseInt(calls[callId].number))
                }

                if (contact) {
                    for (const contactId of Object.keys(contact.endpoints)) {
                        if (numbers.includes(contact.endpoints[contactId].number)) return false
                    }
                } else if (number) {
                    if (numbers.includes(number)) return false
                }

                return true
            },
            openPopoutView: function() {
                // This is only available in extensions.
                if (app.env.isExtension) {
                    browser.tabs.create({url: browser.runtime.getURL('index.html?popout=true')})
                }
            },
            openTab: _helpers.openTab,
            playSound: _helpers.playSound,
            setLayer: function(layerName) {
                app.setState({ui: {layer: layerName}}, {encrypt: false, persist: true})
            },
            setOverlay: function(layerName) {
                app.setState({ui: {overlay: layerName}})
            },
            setTab: function(category, name, condition = true) {
                if (!condition) return
                app.setState({ui: {tabs: {[category]: {active: name}}}}, {encrypt: false, persist: true})
            },
            setupCall: function(description) {
                app.emit('bg:calls:call_create', {description, start: true, transfer: false})
                // Clean up the number so it is gone when the keypad reappears after the call.
                description.endpoint = ''
            },
            toggleEditMode: function() {
                app.setState({app: {editMode: !app.state.app.editMode}}, {persist: true})
            },
            translations: function(category, key) {
                if (!this._translations) this._translations = this.getTranslations()
                return this._translations[category][key]
            },
        }, _helpers.sharedMethodsMixin)
    }


    /**
    * Shared computed properties for Vue components.
    * Be aware that using these properties also require
    * your Vue components to provide all the expected
    * properties from the store.
    * @returns {Object} - Commonly used shared properties.
    */
    _helpers.sharedComputed = function() {
        return {
            callAccepted: _helpers.callAccepted,
            callActive: _helpers.callActive,
            callingDisabled: _helpers.callingDisabled,
            callOngoing: _helpers.callOngoing,
            callsReady: _helpers.callsReady,
            callStatus: function() {
                const translations = _helpers.getTranslations().call
                if (this.call.status === 'accepted') {
                    if (this.call.hold.active) return translations.accepted.hold
                    return translations.accepted[this.call.type]
                }
                return translations[this.call.status]
            },
            greeting: function() {
                let hours = new Date().getHours()
                if (hours < 12) return this.$t('good morning')
                else if (hours >= 12 && hours <= 17) return this.$t('good afternoon').ca()
                else return this.$t('good evening')
            },
            hours: function() {
                return Math.trunc((this.call.timer.current - this.call.timer.start) / 1000 / 60 / 60) % 24
            },
            minutes: function() {
                return Math.trunc((this.call.timer.current - this.call.timer.start) / 1000 / 60) % 60
            },
            seconds: function() {
                return Math.trunc((this.call.timer.current - this.call.timer.start) / 1000) % 60
            },
            sessionTime: function() {
                let formattedTime
                if (this.minutes <= 9) formattedTime = `0${this.minutes}`
                else formattedTime = `${this.minutes}`
                if (this.seconds <= 9) formattedTime = `${formattedTime}:0${this.seconds}`
                else formattedTime = `${formattedTime}:${this.seconds}`
                return formattedTime
            },
            transferStatus: function() {
                let transferStatus = false
                const calls = this.$store.calls.calls
                const callKeys = Object.keys(calls)

                for (let callId of callKeys) {
                    if (calls[callId].transfer.active) {
                        transferStatus = 'select'
                    }
                }
                return transferStatus
            },
        }
    }


    _helpers.sharedValidations = function() {
        const v = Vuelidate.validators
        return {
            settings: {
                webrtc: {
                    account: {
                        selected: {
                            id: {
                                customValid: Vuelidate.withParams({
                                    message: '',
                                    type: 'customValid',
                                }, () => {
                                    // No validation without WebRTC toggled off.
                                    if (!this.settings.webrtc.toggle) return true
                                    else {
                                        if (this.settings.sip.account.status === 'loading') return false
                                        else if (this.settings.sip.account.selected.id) return true
                                    }
                                    return false
                                }),
                                requiredIf: v.requiredIf(() => {
                                    return this.settings.webrtc.toggle
                                }),
                            },
                        },
                    },
                },
            },
        }
    }


    _helpers.validators = {
        // Regex source: https://github.com/johnotander/domain-regex/blob/master/index.js
        domain: function(e) {
            e = e ? e : ''
            let res = e.match(/\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b/)
            if (!res) return false
            return true
        },
    }


    /**
    * Set user state to unauthenticated and notify the background.
    */
    _helpers.logout = function() {
        app.emit('bg:user:logout')
    }

    return _helpers
}


module.exports = helpers
