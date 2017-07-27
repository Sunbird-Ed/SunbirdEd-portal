// Karma configuration
// Generated on 2017-05-10

module.exports = function (config) {
    'use strict';

    config.set({
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        // as well as any additional frameworks (requirejs/chai/sinon/...)
        frameworks: [
            'jasmine'
        ],

        // list of files / patterns to load in the browser
        files: [
            // bower:js
            'app/thirdparty/bower_components/jquery/dist/jquery.js',
            'app/thirdparty/bower_components/jasmine-jquery/lib/jasmine-jquery.js',// eslint-disable-line
            'app/thirdparty/semantic/semantic.min.js',
            'app/thirdparty/bower_components/angular/angular.js',
            'app/thirdparty/bower_components/angular-mocks/angular-mocks.js',
            'app/thirdparty/bower_components/angular-resource/angular-resource.js',// eslint-disable-line
            'app/thirdparty/bower_components/angular-cookies/angular-cookies.js',// eslint-disable-line
            'app/thirdparty/bower_components/angular-sanitize/angular-sanitize.js',// eslint-disable-line
            'app/thirdparty/bower_components/angular-route/angular-route.js',
            // endbower
            'app/scripts/app.js',
            'app/scripts/**/*.js',
            'test/mock/**/*.js',
            'test/spec/**/*.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            'PhantomJS'
        ],

        // Which plugins to enable
        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage'
        ],

        // preprocess matching files before serving them to the browser
        preprocessors: {
            'app/scripts/**/*.js': ['coverage']
        },

        reporters: ['dots', 'coverage'],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE ||
        // LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Uncomment the following lines if you are
        // using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
        coverageReporter: {
            reporters: [
                { type: 'html', dir: 'coverage/' },
                { type: 'text-summary' },
                { type: 'cobertura' }
            ]
        }
    });
};
