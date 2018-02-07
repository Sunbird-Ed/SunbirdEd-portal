// Karma configuration
// Generated on 2017-05-10

module.exports = function (config) {
  'use strict'

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
    // 'karma-phantomjs-launcher',
    // 'karma-chrome-launcher',
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-coverage',
      'karma-mocha-reporter'
    ],

    // preprocess matching files before serving them to the browser
    preprocessors: {
      'app/private/scripts/**/*.js': ['coverage'],
      'app/public/scripts/**/*.js': ['coverage']
    },

    reporters: ['progress', 'coverage', 'mocha'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE ||
    // LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are
    // using gulp's test to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
    coverageReporter: {
      reporters: [
        { type: 'html', dir: 'coverage/portal' },
        { type: 'text-summary', dir: 'coverage/portal' },
        { type: 'cobertura', dir: 'coverage/portal' }
      ]
    }
  })
}
