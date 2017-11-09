'use script'

var gulp = require('gulp')
var $ = require('gulp-load-plugins')()
var rimraf = require('rimraf')
var paths = require('./paths.js')
var jasmineNode = require('gulp-jasmine-node')
var istanbul = require('gulp-istanbul')
var runSequence = require('run-sequence')
var file = require('gulp-file')
var inject = require('gulp-inject')
var angularFileSort = require('gulp-angular-filesort')
var argv = require('yargs').argv

var privateJsFiles = []
var publicJsFiles = []

/* below tasks for node js code testcases to run
 use test-server-js to run all the testcases for server side js files
 */

// Below task is to clean up the reports
gulp.task('clean-coverage-node', function (cb) {
  rimraf(paths.src.nodeCoverage, cb)
})

// Below task is used setup source files
gulp.task('pre-test-node', function () {
  return gulp.src(paths.src.nodeScripts)
    .pipe(istanbul({ includeUntested: true }))
    .pipe(istanbul.hookRequire())
})

// Below task used to run the test cases for server side js files
gulp.task('test-server-js', ['clean-coverage-node', 'pre-test-node'], function () {
  return gulp.src(paths.src.nodeSpecs)
    .pipe(jasmineNode({
      timeout: 10000
    }))
    .pipe(istanbul.writeReports({ dir: paths.src.nodeCoverage, reporters: ['html', 'text-summary'] }))
})

/**
 * Below tasks for angular frontend code
 * use test to run all the testcases for frontend side file
 */

 // Below task is to clean up the portal coverage report
gulp.task('clean-coverage-portal', function (cb) {
  rimraf(paths.src.portalCoverage, cb)
})

// Below task is used to get all private scripts files from index.ejs
gulp.task('inject-private-script', function (callback) {
  file(paths.player.app + 'index.ejs', '<html><body></body></html>')
    .pipe(inject(gulp.src(paths.player.app + '/**/*.js', { read: true }).pipe(angularFileSort()), {
      addRootSlash: false,
      name: 'fix-inject',
      starttag: '<body>',
      endtag: '</body>',
      transform: function (filePath, file, index, length) {
        privateJsFiles.push(filePath)
        if (index === length - 1) {
          callback()
        }
      }
    }))
})

// Below task is used to get all public scripts files from index.html
gulp.task('inject-public-script', function (callback) {
  file(paths.player.public + 'index.html', '<html><body></body></html>')
    .pipe(inject(gulp.src(paths.player.public + '/**/*.js', { read: true }).pipe(angularFileSort()), {
      addRootSlash: false,
      name: 'fix-inject',
      starttag: '<body>',
      endtag: '</body>',
      transform: function (filePath, file, index, length) {
        publicJsFiles.push(filePath)
        if (index === length - 1) {
          callback()
        }
      }
    }))
})

// Below task is used to clean code coverage folder. and inject all private and public files
gulp.task('pre-test', function () {
  var resouceBundleFiles = [
    'app/common/js/frmelmnts.js',
    'app/common/js/messages.js'
  ]
  var testToFiles = paths.src.testRequire.concat(resouceBundleFiles, privateJsFiles, publicJsFiles, paths.src.test)
  var kConfig = {
    configFile: paths.src.karma
  }
  if (Object.keys(argv).indexOf('watch') !== -1) {
    kConfig.action = 'watch'
  }
  return gulp.src(testToFiles)
    .pipe($.karma(kConfig))
})

// Below task is used for run all task related to test
gulp.task('test-angular-frontend', function (callback) {
  runSequence('clean-coverage-portal', 'inject-private-script', 'inject-public-script',
    'pre-test', callback)
})
