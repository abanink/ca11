/** @memberof lib */
/**
* Simple environment detection for the DOM and JavaScript.
* Ca11 tries to be environment-agnostic, but sometimes
* a condition needs to be made, based on the current environment
* the code runs in.
* @module env
*/

/**
* Call this method in the script context to get
* the context back as an object.
* @param {Object} opts - Options
* @param {String} opts.section - The section of an app that the running script represents.
* @returns {Object} - Environment-specific flags.
*/
function env({section}) {
    let _env = {
        isAndroid: false,
        isBrowser: false,
        isChrome: false,
        isEdge: false,
        isElectron: false,
        isExtension: false,
        isFirefox: false,
        isLinux: false,
        isMacOS: false,
        isNode: false,
        isStandalone: false,
        isWindows: false,
        name: 'unknown',
        section: {
            app: false,
            bg: false,
            fg: false,
            observer: false,
        },
    }

    _env.section[section] = true

    let ua

    if (global.document) {
        ua = navigator.userAgent.toLowerCase()
        _env.isAndroid = ua.includes('android')

        if (ua.includes('edge')) {
            _env.isEdge = true
            _env.name = 'edge'
        } else if (ua.includes('firefox')) {
            _env.isFirefox = true
            _env.name = 'firefox'
        } else if (ua.includes('chrome')) {
            _env.isChrome = true
            _env.name = 'chrome'
        }
    } else {
        _env.isNode = true
        _env.name = 'node'
    }

    try {
        if ((chrome && chrome.extension) || (browser && browser.extension)) {
            _env.isExtension = true
        }
    } catch (e) {
        // Catch reference errors.
    }

    if (global.navigator) {
        _env.isBrowser = true

        if (navigator.platform.match(/(Linux)/i)) _env.isLinux = true
        else if (navigator.platform.match(/(Mac)/i)) _env.isMacOS = true
        else if (navigator.platform.match(/(Windows|Win32)/i)) _env.isWindows = true
        if (_env.section.fg) {
            if (location.search.includes('test=true')) {
                $('html').classList.add('test')
            }

            if (location.search.includes('mode=standalone')) {
                _env.isStandalone = true
                $('html').classList.add('standalone')
            }

            if (_env.isChrome) $('html').classList.add('chrome')
            if (_env.isEdge) $('html').classList.add('edge')
            if (_env.isFirefox) $('html').classList.add('firefox')
            if (_env.isExtension) $('html').classList.add('extension')
            if (_env.isAndroid) $('html').classList.add('android')
        }
    }

    try {
        // Skip electron from transpilation.
        let electronNamespace = 'electron'
        window.electron = require(electronNamespace)
        _env.isElectron = true
        if (_env.section.fg) {
            $('html').classList.add('electron')
        }
    } catch (e) {
        // Catch reference errors.
    }

    return _env
}


module.exports = env
