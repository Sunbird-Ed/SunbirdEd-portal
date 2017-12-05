'use strict'

var gulp = require('gulp')
var less = require('gulp-less')
var autoprefixer = require('gulp-autoprefixer')
var plumber = require('gulp-plumber')
var paths = require('./paths')

// Below task generate the css from less
gulp.task('build-css', function () {
  return gulp.src(paths.player.app + 'styles/main.less')
      .pipe(plumber())
      .pipe(less())
      .pipe(autoprefixer())
      .pipe(gulp.dest(paths.player.common + 'styles'))
})
