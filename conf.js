// solves `SyntaxError: Unexpected token import`
require("babel-register")({
    presets: [ 'es2015' ]
});

exports.config = {
    
    // Connect directly to Chrome via directConnect

    directConnect: true,

    specs: ['specs/loginSpec.js'],

    framework: 'jasmine',

    onPrepare: () => {
        // Override the timeout for webdriver.
	    // browser.driver.manage().timeouts().implicitlyWait(60000);

        // Adding Spec Reporter
        const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
        jasmine.getEnv().addReporter(new SpecReporter({
            spec: {
                displayStacktrace: true
            }
        }));

        var AllureReporter = require('jasmine-allure-reporter');
		jasmine.getEnv().addReporter(new AllureReporter({
			allureReport: {
                resultsDir: 'test-results',
			}
		}));

        // Adding Screenshot Utility
        jasmine.getEnv().afterEach(function (done) {
			browser.takeScreenshot().then(function (png) {
				allure.createAttachment('Screenshot', function () {
					return new Buffer.from(png, 'base64')
				}, 'image/png')();
				done();
			})
		});

    },

    capabilities: {
        browserName: 'chrome',
        shardTestFiles: true,
        maxInstances: 1,
        chromeOptions: {
            args: [
                '--disable-infobars',
                '--disable-extensions',
                'verbose',
                'log-path=/tmp/chromedriver.log'
            ],
            prefs: {
                'profile.password_manager_enabled': false,
                'credentials_enable_service': false,
                'password_manager_enabled': false
            }
        }
    },

    jasmineNodeOpts: {
        showColors: true,
        displaySpecDuration: true,
        print: () => {},
        defaultTimeoutInterval: 50000
    }
};