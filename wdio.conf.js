// The URL every test in this project starts from
export const BASE_URL = 'https://app.thecasework.com/';

export const config = {
    // ====================
    // Runner
    // ====================
    runner: 'local',

    // ====================
    // Specs (test files)
    // ====================
    specs: [
        './test/specs/**/*.js'
    ],
    exclude: [],

    // ====================
    // Capabilities (browsers)
    // ====================
    maxInstances: 1,
    capabilities: [{
        browserName: 'chrome'
        // To run without opening a browser window, uncomment:
        // 'goog:chromeOptions': { args: ['--headless=new', '--window-size=1920,1080'] }
    }],

    // ====================
    // Test settings
    // ====================
    logLevel: 'error',
    bail: 0,
    baseUrl: BASE_URL,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    // ====================
    // Hooks
    // ====================
    before: async function () {
        // The Clients table hides Address and Active Case Count on narrow
        // windows, so always use a wide desktop size.
        await browser.setWindowSize(1440, 900);
    },

    // Take a screenshot when a test fails
    afterTest: async function (test, context, { passed }) {
        if (!passed) {
            await browser.saveScreenshot(`./screenshots/${test.title.replace(/\s+/g, '_')}.png`);
        }
    }
};
