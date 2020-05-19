// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const argv = require('minimist')(process.argv.slice(2))
const tags = (argv.tags !== true) && argv.tags

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['parallel', 'jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-parallel'),
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-mocha-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    parallelOptions: {
      executors: (Math.ceil(require('os').cpus().length / 2)), // Defaults to cpu-count - 1
      shardStrategy: 'round-robin'
      // shardStrategy: 'description-length'
      // shardStrategy: 'custom'
      // customShardStrategy: function(config) {
      //   config.executors // number, the executors set above
      //   config.shardIndex // number, the specific index for the shard currently running
      //   config.description // string, the name of the top-level describe string. Useful //     for determining how to shard the current specs
      //   return config.
      // }
      },
    browserNoActivityTimeout: 100000,
    client: {
      jasmine: {
        timeoutInterval: 50000
      },
      args: [tags],
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    
    reporters: ['mocha'],
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
    logLevel: config.LOG_INFO,
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
          '--max_old_space_size=4096',
          "--js-flags=--max-old-space-size=4096",
          "--disable-dev-shm-usage"
        ]
      }
    },
    singleRun: false
  })
}
