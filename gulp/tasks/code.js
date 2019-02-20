const {_extend, promisify} = require('util')
const fs = require('fs')
const path = require('path')

const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const composer = require('gulp-uglify/composer')
const envify = require('gulp-envify')

const gulp = require('gulp')
const ifElse = require('gulp-if-else')
const logger = require('gulplog')
const minifier = composer(require('uglify-es'), console)
const notify = require('gulp-notify')
const size = require('gulp-size')
const source = require('vinyl-source-stream')
const sourcemaps = require('gulp-sourcemaps')
const through = require('through2')
const watchify = require('watchify')

const writeFileAsync = promisify(fs.writeFile)

let bundlers = {}
let helpers = {}
let tasks = {}


module.exports = function(settings) {
    /**
     * Create a Browserify bundle.
     * @param {Object} options - Options to pass.
     * @param {Array} options.addons - Extra bundle entries.
     * @param {String} options.destination - Override the default destination.
     * @param {String} options.entry - Entrypoint file.
     * @param {String} options.name - Bundle name.
     * @param {Array} options.requires - Extra bundle requires.
     * @returns {Promise} - Resolves when bundling is finished.
     */
    helpers.compile = function({addons = [], destination = './js', entry, name, requires = []}) {
        const brand = settings.brands[settings.BRAND_TARGET]

        if (!bundlers[name]) {
            let bundlerOptions = {
                basedir: settings.BASE_DIR,
                cache: {},
                debug: !settings.BUILD_OPTIMIZED,
                packageCache: {},
                paths: [
                    settings.NODE_DIR,
                    path.join(settings.ROOT_DIR, '../'),
                ],
            }

            if (entry) bundlerOptions.entries = entry
            bundlers[name] = browserify(bundlerOptions)

            if (settings.LIVERELOAD) bundlers[name].plugin(watchify)

            for (let _addon of addons) bundlers[name].add(_addon)
            for (const _require of requires) bundlers[name].require(_require)

            bundlers[name].ignore('buffer')
            bundlers[name].ignore('process')
            bundlers[name].ignore('rc')
            bundlers[name].ignore('module-alias/register')

            helpers.transform(bundlers[name])
        }

        return new Promise((resolve) => {
            bundlers[name].bundle()
                .on('error', notify.onError('Error: <%= error.message %>'))
                .on('end', () => {resolve()})
                .pipe(source(`${name}.js`))
                .pipe(buffer())
                .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(helpers.envify(brand))
                .pipe(ifElse(settings.BUILD_OPTIMIZED, () => minifier()))
                .pipe(sourcemaps.write('./'))
                .pipe(size(_extend({title: `${name}.js`}, settings.SIZE_OPTIONS)))
                .pipe(gulp.dest(path.join(settings.BUILD_DIR, destination)))
        })
    }


    helpers.envify = function(brand) {
        return envify({
            APP_NAME: brand.name.production,
            BRAND_TARGET: settings.BRAND_TARGET,

            BUILD_VERBOSE: settings.BUILD_VERBOSE,
            BUILTIN_CONTACTS_I18N: brand.plugins.builtin.contacts.i18n,
            BUILTIN_CONTACTS_PROVIDERS: brand.plugins.builtin.contacts.providers,
            CUSTOM_MOD: brand.plugins.custom,

            NODE_ENV: settings.NODE_ENV,
            PUBLISH_CHANNEL: settings.PUBLISH_CHANNEL,
            SENTRY_DSN: brand.telemetry.sentry.dsn,
            SIG11_ENDPOINT: brand.sig11.endpoint,
            SIP_ENDPOINT: brand.sip.endpoint,
            STUN: brand.stun,

            VENDOR_NAME: brand.vendor.name,
            VENDOR_SUPPORT_EMAIL: brand.vendor.support.email,
            VENDOR_SUPPORT_PHONE: brand.vendor.support.phone,
            VENDOR_SUPPORT_WEBSITE: brand.vendor.support.website,
            VENDOR_WEBSITE: brand.vendor.website,
            VERSION: settings.PACKAGE.version,
        })
    }


    helpers.plugins = async function(sectionModules) {
        let requires = []

        for (const moduleName of Object.keys(sectionModules)) {
            const sectionModule = sectionModules[moduleName]

            if (sectionModule.adapter) {
                logger.info(`adapter plugin ${moduleName} (${sectionModule.adapter})`)
                requires.push(`${sectionModule.adapter}/src/js`)
            } else if (sectionModule.providers) {
                for (const provider of sectionModule.providers) {
                    logger.info(`provider plugin ${moduleName} (${provider})`)
                    requires.push(`${provider}/src/js`)
                }
            }

            if (sectionModule.addons) {
                for (const addon of sectionModule.addons) {
                    logger.info(`addon plugin ${moduleName} (${addon})`)
                    requires.push(`${addon}/src/js`)
                }
            } else if (sectionModule.name) {
                logger.info(`custom plugin ${moduleName} (${sectionModule.name})`)
                requires.push(`${sectionModule.name}/src/js/`)
            }
        }

        await helpers.compile({name: 'app_plugins', requires})
    }


    /**
     * Allow cleaner imports by rewriting commonjs require.
     *   From: "ca11/bg/plugins/user/adapter"
     *   To: "ca11/src/js/bg/plugins/user/adapter"
     *
     * Within the node runtime, the same kind of aliasing is applied
     * using module-alias. See `package.json` for the alias definition.
     * @param {Browserify} bundler - The Browserify bundler.
     */
    helpers.transform = function(bundler) {
        bundler.transform({global: true}, function(file, opts) {
            // Do a negative look-ahead to exclude matches that contain `ca11/src`.
            const aliasMatch = /(require\('ca11)(?!.*src)./g
            return through(function(buf, enc, next) {
                this.push(buf.toString('utf8').replace(aliasMatch, 'require(\'ca11/src/js/'))
                next()
            })
        })
    }


    tasks.app = async function codeApp(done) {
        await helpers.compile({entry: './src/js/index.js', name: 'app'})
        done()
    }


    tasks.appI18n = async function codeAppI18n(done) {
        await Promise.all([
            helpers.compile({entry: './src/js/i18n/index.js', name: 'app_i18n'}),
        ])
        done()
    }


    tasks.electron = function codeElectron(done) {
        if (settings.BUILD_TARGET !== 'electron') {
            logger.info(`Electron task doesn\'t make sense for build target ${settings.BUILD_TARGET}`)
            return
        }

        // Vendor-specific info for Electron's main.js file.
        fs.createReadStream('./src/js/main.js').pipe(
            fs.createWriteStream(`./build/${settings.BRAND_TARGET}/${settings.BUILD_TARGET}/main.js`)
        )

        const electronBrandSettings = settings.brands[settings.BRAND_TARGET].vendor
        const settingsFile = `./build/${settings.BRAND_TARGET}/${settings.BUILD_TARGET}/settings.json`
        writeFileAsync(settingsFile, JSON.stringify(electronBrandSettings)).then(() => {done()})
    }


    tasks.plugins = function codeAppPlugins(done) {
        const builtin = settings.brands[settings.BRAND_TARGET].plugins.builtin
        const custom = settings.brands[settings.BRAND_TARGET].plugins.custom

        Promise.all([
            helpers.plugins(Object.assign(builtin, custom)),
        ]).then(() => {
            done()
        })
    }


    tasks.serviceWorker = async function codeServiceWorker(done) {
        await helpers.compile({destination: './', entry: './src/js/sw.js', name: 'sw'})
        done()
    }


    tasks.vendor = async function codeVendor(done) {
        await helpers.compile({
            // Add the compiled svg icon components to the vendor build.
            addons: [
                path.join(settings.TEMP_DIR, settings.BRAND_TARGET, 'build', 'index.js'),
            ],
            entry: './src/js/vendor.js',
            name: 'vendor',
        })
        done()
    }

    return {helpers, tasks}
}
