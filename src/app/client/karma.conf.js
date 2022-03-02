// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const argv = require('minimist')(process.argv.slice(2))
const tags = (argv.tags !== true) && argv.tags

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    middleware: ['fake-url'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-mocha-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      {
        'middleware:fake-url': [
          'factory',
          function () {
            // Middleware that avoids triggering 404s during tests that need to reference
            // image paths. Assumes that the image path will start with `/$`.
            return function (request, response, next) {
              // if (request.url.indexOf('/$') === 0) {
                response.writeHead(200);
                return response.end();
              // }
              // next();
            };
          },
        ],
      },
    ],
    browserNoActivityTimeout: 100000,
    // captureTimeout: 210000,
    browserDisconnectTimeout : 200000,
    // The `disconnectTolerance` value represents the maximum number of tries a browser will attempt in
    // the case of a disconnection. Usually, any disconnection is considered a failure, but this option
    // allows you to define a tolerance level when there is a flaky network link
    // between the Karma server and the browsers.
    browserDisconnectTolerance: 2,
    transports: ['websocket', 'polling'],
    client: {
      jasmine: {
        timeoutInterval: 300000
      },
      args: [tags],
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage'), reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    reporters: ['mocha', 'coverage-istanbul'],
    mochaReporter: {
      symbols: {
        success: '+',
        info: '#',
        warning: '!',
        error: 'x'
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          '--remote-debugging-port=9222',
          '--proxy-server=direct://',
          '--proxy-bypass-list=*',
          '--max_old_space_size=4096'
        ]
      }
    },
    singleRun: false
  })
}
