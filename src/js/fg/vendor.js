global.Vue = require('vue/dist/vue.runtime')
require('../lib/vendor')

global.vClickOutside = require('v-click-outside')
Vue.use(global.vClickOutside)

global.Vuelidate = require('vuelidate/dist/vuelidate.min')
global.Vuelidate.validators = require('vuelidate/dist/validators.min')
Vue.use(global.Vuelidate.default)

global.Raven = require('raven-js')
global.shortid = require('shortid')
