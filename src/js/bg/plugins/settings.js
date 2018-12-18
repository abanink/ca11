/**
* This module takes care of dealing with all
* settings and responding to changes to it.
* @module ModuleSettings
*/
const Plugin = require('ca11/lib/plugin')


/**
* Main entrypoint for Settings.
* @memberof AppBackground.plugins
*/
class PluginSettings extends Plugin {
    /**
    * Initializes the module's store.
    * All application runtime settings are defined here. Build-time
    * settings go in the ``~/.ca11rc` file.
    * @returns {Object} The module's store properties.
    */
    _initialState() {
        let state = {
            platform: {
                url: process.env.PLATFORM_URL,
            },
            ringtones: {
                options: [
                    {id: 1, name: 'default.ogg'},
                ],
                selected: {id: 1, name: 'default.ogg'},
            },
            telemetry: {
                enabled: false,
                sentryDsn: process.env.SENTRY_DSN,
            },
            webrtc: {
                devices: {
                    input: [],
                    output: [],
                    ready: true,
                    sinks: {
                        headsetInput: {id: 'default', name: this.app.$t('default').capitalize()},
                        headsetOutput: {id: 'default', name: this.app.$t('default').capitalize()},
                        ringOutput: {id: 'default', name: this.app.$t('default').capitalize()},
                        speakerInput: {id: 'default', name: this.app.$t('default').capitalize()},
                        speakerOutput: {id: 'default', name: this.app.$t('default').capitalize()},
                    },
                    speaker: {
                        enabled: false,
                    },
                },
                enabled: true,
                media: {
                    permission: true,
                    stream: {
                        id: null,
                        kind: 'audio',
                        local: true,
                        muted: false,
                        selected: false,
                        visible: true,
                    },
                    type: {
                        options: [
                            {id: 'AUDIO_NOPROCESSING', name: this.app.$t('disabled')},
                            {id: 'AUDIO_PROCESSING', name: this.app.$t('enabled')},
                        ],
                        selected: {id: 'AUDIO_NOPROCESSING', name: this.app.$t('disabled')},
                    },
                },
                stun: process.env.STUN,
                toggle: true,
            },
            wizard: {
                completed: false,
                steps: {
                    options: [
                        {name: 'WizardWelcome'},
                        {name: 'WizardTelemetry'},
                        {name: 'WizardMicPermission'},
                        {name: 'WizardDevices'},
                    ],
                    selected: {name: 'WizardWelcome'},
                },
            },
        }

        return state
    }


    /**
    * Refresh the devices list when this plugin is started, but
    * only if the Vault is unlocked, because the devices list is
    * stored in the encrypted part of the store, which should be
    * available at that point. An additional vault unlock watcher
    * is used to refresh the devices list when auto unlocking is
    * disabled.
    */
    _ready() {
        if (!this.app.state.settings.telemetry.enabled) {
            Raven.uninstall()
            return
        }

        const release = process.env.VERSION + '-' + process.env.PUBLISH_CHANNEL + '-' + process.env.BRAND_TARGET + '-' + this.app.env.name
        this.app.logger.info(`${this}monitoring exceptions for release ${release}`)
        Raven.config(process.env.SENTRY_DSN, {
            allowSecretKey: true,
            environment: process.env.PUBLISH_CHANNEL,
            release,
            tags: {
                sipjs: SIP.version,
                vuejs: Vue.version,
            },
        }).install()

        Raven.setUserContext({
            email: this.app.state.user.username,
            id: `${this.app.state.user.client_id}/${this.app.state.user.id}`,
        })
    }


    /**
    * Respond to changes in settings, like storing the Vault key,
    * toggle the Click-to-dial icon observer, etc..
    * @returns {Object} The store properties to watch.
    */
    _watchers() {
        return {
            'store.settings.telemetry.enabled': (enabled) => {
                this.app.logger.info(`${this}switching sentry exception monitoring ${enabled ? 'on' : 'off'}`)
                if (enabled) {
                    const sentryDsn = this.app.state.settings.telemetry.sentryDsn
                    Raven.config(sentryDsn, {
                        allowSecretKey: true,
                        environment: process.env.PUBLISH_CHANNEL,
                        release: this.app.state.app.version.current,
                    }).install()
                } else {
                    this.app.logger.info(`${this}stop raven exception monitoring`)
                    Raven.uninstall()
                }
            },
            /**
            * The default value is true.
            * @param {Boolean} enabled - Permission granted?
            */
            'store.settings.webrtc.media.permission': (enabled) => {
                if (enabled) {
                    this.app.devices.verifySinks()
                }
            },
        }
    }


    /**
    * Generate a representational name for this module. Used for logging.
    * @returns {String} - An identifier for this module.
    */
    toString() {
        return `${this.app}[settings] `
    }
}

module.exports = PluginSettings
