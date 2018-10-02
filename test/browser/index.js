const {promisify} = require('util')
const mkdirp = promisify(require('mkdirp'))
const path = require('path')
const puppeteer = require('puppeteer')
const test = require('tape')

// Environment initialization.
const BRAND = process.env.BRAND ? process.env.BRAND : 'ca11'
const SCREENS = process.env.SCREENS ? true : false

const settings = require('../../tools/settings')(path.join(__dirname, '../../'))
// Force to webview.
settings.BUILD_TARGET = 'webview'

const brand = settings.brands[BRAND]

// An environment flag may override the default headless setting.
let HEADLESS
if (process.env.HEADLESS) {
    HEADLESS = process.env.HEADLESS === '1' ? true : false
} else HEADLESS = brand.tests.headless

let stepNumber = 0

Object.assign(brand.tests, {
    step: function(runner) {
        stepNumber += 1
        // Don't use steps in the filename, because the step number
        // may defer per build.
        return `${stepNumber}-${runner._name}-`
    },
    steps: {},
})

// Application sections.
const testCall = require('./call')(settings)
const testSession = require('./session')(settings)
const testSettings = require('./settings')(settings)
const testWizard = require('./wizard')(settings)


// WARNING: Do NOT log CI variables while committing to Github.
// This may expose the Circle CI secrets in the build log.
// Change account credentials immediately when this happens.
if (process.env[`CI_USERNAME_ALICE_${BRAND.toUpperCase()}`]) {
    brand.tests.endpoint = process.env[`CI_ENDPOINT_${BRAND.toUpperCase()}`]
    brand.tests.alice.username = process.env[`CI_USERNAME_ALICE_${BRAND.toUpperCase()}`]
    brand.tests.alice.password = process.env[`CI_PASSWORD_ALICE_${BRAND.toUpperCase()}`]
    brand.tests.bob.username = process.env[`CI_USERNAME_BOB_${BRAND.toUpperCase()}`]
    brand.tests.bob.password = process.env[`CI_PASSWORD_BOB_${BRAND.toUpperCase()}`]
}


/**
* Each test user has its own browser.
* @param {String} name - Name of the testrunner.
* @param {Object} options - Options to pass to the runner.
* @returns {Object} - Browser and pages.
*/
async function createBrowser(name, options) {
    let browser = await puppeteer.launch({
        args: [
            '--disable-notifications',
            '--disable-web-security',
            '--hide-scrollbars',
            '--ignore-certificate-errors',
            '--no-sandbox',
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
        ],
        headless: HEADLESS,
        pipe: true,
    })

    let pages = await browser.pages()
    pages[0]._name = name
    return {browser, pages}
}


test('<alice,bob> start a new session', async(t1) => {
    if (SCREENS) await mkdirp(settings.SCREENS_DIR)

    let [browserAlice, browserBob] = await Promise.all([createBrowser('alice'), createBrowser('bob')])
    let alice = browserAlice.pages[0]
    let bob = browserBob.pages[0]

    alice.setViewport({height: 600, width: 500})
    bob.setViewport({height: 600, width: 500})

    const uri = `http://127.0.0.1:${brand.tests.port}/index.html?test=true`
    await Promise.all([alice.goto(uri, {}), bob.goto(uri, {})])

    await Promise.all([
        await testSession.new(alice, SCREENS),
        await testSession.new(bob, false),
    ])

    t1.end()

    test('<alice,bob> complete the wizard', async(t2) => {
        const aliceContainer = await alice.$('#app')
        let [aliceOptions, bobOptions] = await Promise.all([
            await testWizard(alice, SCREENS),
            await testWizard(bob, false),
        ])

        if (SCREENS) await aliceContainer.screenshot({path: path.join(settings.SCREENS_DIR, `${brand.tests.step(alice)}ready-to-use.png`)})

        await Promise.all([
            alice.click('.test-delete-notification'),
            bob.click('.test-delete-notification'),
        ])

        // Check that there are 3 fake input/output/sound devices at the start.
        const aliceDevices = aliceOptions.input.length + aliceOptions.output.length + aliceOptions.sounds.length
        const bobDevices = bobOptions.input.length + bobOptions.output.length + bobOptions.sounds.length
        t2.equal(aliceDevices + bobDevices, 18, '<alice,bob> devices are available')
        t2.end()

        test('<alice,bob> enable sip service', async(t3) => {
            await Promise.all([
                testSettings.enableSip(alice, SCREENS),
                testSettings.enableSip(bob, false),
            ])

            t3.end()

            test('<alice> initiate call to bob', async(t4) => {
                await testCall.callNumber(alice, SCREENS, brand.tests.bob.username)
                t4.end()

                test('<bob> answer incoming call from alice', async(t5) => {
                    await testCall.answerCall({callee: bob, caller: alice}, SCREENS)

                    t5.end()
                    await browserAlice.browser.close()
                    await browserBob.browser.close()
                })
            })
        })
    })
})
