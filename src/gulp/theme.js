'use strict'

var gulp = require('gulp')
var less = require('gulp-less')
var autoprefixer = require('gulp-autoprefixer')
var plumber = require('gulp-plumber')
var rimraf = require('gulp-rimraf')
var runSequence = require('run-sequence')
var chug = require('gulp-chug')
var paths = require('./paths')
var argv = require('yargs').argv
var fs = require('fs')
var console = require('console')

var customThemes = [
  { name: 'default', path: paths.build_themes.themes + '/default' },
  { name: 'material', path: paths.build_themes.themes + '/material' }
]

var generateThemesTasks = function (themes) {
  themes.forEach(function (theme) {
    gulp.task('build-theme-' + theme.name, function (done) {
      buildTheme(theme, done)
    })
  })
}

generateThemesTasks(customThemes)

// Below task generate the themes
gulp.task('build-theme', function (cb) {
  if (Object.keys(argv).indexOf('name') !== -1) {
    if (typeof argv.name !== 'string') {
      console.error('please enter the theme name')
    }
    if (!fs.existsSync(paths.build_themes.themes + '/' + argv.name + '/' + 'theme.config')) {
      console.error('theme.config not found, add your theme.config in sementic/src/themes/' + argv.name)
    } else {
      generateThemesTasks([{ name: argv.name, path: paths.build_themes.themes + '/' + argv.name }])
      runSequence('build-theme-' + argv.name, cb)
    }
  }

  if (Object.keys(argv).indexOf('create') !== -1) {
    if (typeof argv.create !== 'string') {
      console.error('please enter the theme name')
    } else {
      runSequence('create-theme', cb)
    }
  }

  if (Object.keys(argv).indexOf('watch') !== -1) {
    if (typeof argv.watch !== 'string') {
      console.error('please enter the theme name')
    } else {
      runSequence('watch-theme', cb)
    }
  }
})

var buildTheme = function (theme, done) {
  gulp.task('remove-config', function () {
    return gulp.src('semantic/src/theme.config')
      .pipe(rimraf())
  })

  gulp.task('add-new-config', function () {
    return gulp.src([theme.path + '/theme.config'])
      .pipe(gulp.dest('semantic/src/'))
  })

  gulp.task('generate-themes', function () {
    return gulp.src('semantic/gulpfile.js', function () {})
      .pipe(chug({
        tasks: ['build']
      }, function () {
        gulp.src(['semantic/dist/semantic.min.css'])
          .pipe(gulp.dest(paths.build_themes.dist + theme.name + '/'))
        gulp.src(['app/common/images/Forward.png', 'app/common/images/Backword.png'])
          .pipe(gulp.dest(paths.build_themes.dist + theme.name + '/assets/images'))
        gulp.src(['app/common/fonts/**/*'])
          .pipe(gulp.dest(paths.build_themes.dist + theme.name + '/assets/fonts'))
        gulp.src(['semantic/dist/themes/**/*'])
          .pipe(gulp.dest(paths.build_themes.dist + theme.name + '/themes'))
      }))
  })

  gulp.task('build-custom-css', function () {
    return gulp.src(theme.path + '/custom/main.less')
      .pipe(plumber())
      .pipe(less())
      .pipe(autoprefixer())
      .pipe(gulp.dest(paths.build_themes.dist + theme.name + '/assets/styles'))
  })
  runSequence('remove-config', 'add-new-config', 'generate-themes', 'build-custom-css', done)
}

gulp.task('build-themes', ['clean-themes'], function () {
  var tasks = []
  customThemes.forEach(function (theme) {
    tasks.push('build-theme-' + theme.name)
  })
  runSequence.apply(null, tasks)
})

gulp.task('clean-themes', function () {
  return gulp.src('app/themes/*')
    .pipe(rimraf())
})

gulp.task('create-theme', function (cb) {
  gulp.src(paths.build_themes.themes + '/default/** ')
    .pipe(gulp.dest(paths.build_themes.themes + '/' + argv.create))
  generateThemesTasks([{ name: argv.create, path: paths.build_themes.themes + '/' + argv.create }])
  runSequence('build-theme-' + argv.create, cb)
})

gulp.task('watch-theme', function (cb) {
  generateThemesTasks([{ name: argv.watch, path: paths.build_themes.themes + '/' + argv.watch }])
  gulp.watch(paths.build_themes.themes + '/' + argv.watch + '/**', ['build-theme-' + argv.watch])
})
