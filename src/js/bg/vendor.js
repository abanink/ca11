// Already defined by vendor_fg.js when using a webview which runs
// vendor_bg.js within the same context.
if (!global.Vue) {
    global.Vue = require('vue/dist/vue.runtime')
    require('../lib/vendor')
}

global.Raven = require('raven-js')
// Specific to vendor_bg.js
global.shortid = require('shortid')
global.SIP = require('sip.js')
global.sdpInterop = require('sdp-interop-sl').InteropChrome
