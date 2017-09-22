var gulp = require('gulp');
var rimraf = require('rimraf');
var paths = require('./paths.js');
var jasmineNode = require('gulp-jasmine-node');
var istanbul = require('gulp-istanbul');



/* below tasks for node js code testcases to run
 use test-server-js to run all the testcases for server side js files
 */

// Below task is to clean up the reports
gulp.task('clean-coverage-node', function(cb) {
  rimraf(paths.src.nodeCoverage, cb);
});

// Below task is used setup source files
gulp.task('pre-test-node', function() {
  return gulp.src(paths.src.nodeScripts)
    .pipe(istanbul({ includeUntested: true }))
    .pipe(istanbul.hookRequire());
});

// Below task used to run the test cases for server side js files
gulp.task('test-server-js', ['clean-coverage-node', 'pre-test-node'], function() {
  return gulp.src(paths.src.nodeSpecs)
    .pipe(jasmineNode({
      timeout: 10000
    }))
    .pipe(istanbul.writeReports({ dir: paths.src.nodeCoverage, reporters: ['html', 'text-summary'] }));
});
