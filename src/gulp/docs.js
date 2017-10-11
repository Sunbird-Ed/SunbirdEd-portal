'use strict'
var gulp = require('gulp')
var jsdoc = require('gulp-jsdoc3')
var paths = require('./paths.js')

gulp.task('build-js-docs', function (cb) {
  var config = require(paths.jsdocs_config)
  gulp.src(paths.jsdocs_files, {read: false})
        .pipe(jsdoc(config, cb))
})
