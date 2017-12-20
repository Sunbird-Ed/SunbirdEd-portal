'use strict'

var gulp = require('gulp')
var gulpNgConfig = require('gulp-ng-config')
var paths = require('./paths.js')

// Below task create private const
gulp.task('config-private-const', function () {
  paths.jsonConfigArr.forEach(function (item) {
    gulp.src(paths.player.app + item.path)
    .pipe(gulpNgConfig('playerApp.' + item.name))
    .pipe(gulp.dest(paths.player.app + 'scripts'))
    .pipe(gulp.dest(paths.dist.path + paths.dist.scripts))
  })
})

// Below task create public const
gulp.task('config-public-const', function () {
  paths.jsonConfigPublic.forEach(function (item) {
    gulp.src(paths.player.public + item.path)
    .pipe(gulpNgConfig('loginApp.' + item.name))
    .pipe(gulp.dest(paths.player.public + 'scripts'))
    .pipe(gulp.dest(paths.dist.path + paths.dist.scripts))
  })
})

gulp.task('build-config', ['config-public-const', 'config-private-const'], function (cb) {
  cb()
})
