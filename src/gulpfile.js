'use strict';

var gulp = require('gulp');
var requireDir = require('require-dir');
// Require all tasks.
requireDir('./gulp', { recurse: true });

// This task is to create production build which creates dist folder inside src
// to know see sub tasks the gulp/deploy.js
gulp.task('default', ['packageNodeModules']);

/* Below tasks for node js code test cases to run
 use test-node to run all the test cases for server side js files
 */
gulp.task('test-node', ['test-server-js']);

/* Below tasks for angular code test cases to run
 use test to run all the test cases for angular js files
 */
gulp.task('test', ['test-angular-frontend']);

// Below task is used for generate config
gulp.task('config', ['build-config']);

// Below task is used for generate css
gulp.task('css', ['build-css']);
