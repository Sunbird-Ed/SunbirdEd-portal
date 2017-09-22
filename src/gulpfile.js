// Generated on 2017-05-10 using generator-angular 0.16.0

'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var chug = require('gulp-chug');
var clean = require('gulp-clean');
var lazypipe = require('lazypipe');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var gulpNgConfig = require('gulp-ng-config');
var less = require('gulp-less');
var minifyHTML = require('gulp-minify-html');
var minify = require('gulp-minifier');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var merge = require('merge-stream');
var gzip = require('gulp-gzip');
var map = require('map-stream');
var file = require('gulp-file');
var angularFileSort = require('gulp-angular-filesort');
var jasmineNode = require('gulp-jasmine-node');
var istanbul = require('gulp-istanbul');
var private_js_files = [];
var public_js_files = [];
var requireDir = require('require-dir');
// Require all tasks.
requireDir('./gulp', { recurse: true });


//This task is to create production build which creates dist folder inside src
//to know see sub tasks the gulp/deploy.js
gulp.task('default', ['packageNodeModules']);


/* Below tasks for node js code testcases to run
 use test-node to run all the testcases for server side js files
 */
gulp.task('test-node', ['test-server-js']);


var lintScripts = lazypipe()
  .pipe($.jshint, '.jshintrc')
  .pipe($.jshint.reporter, 'jshint-stylish');

// /////////
// Tasks //
// /////////

gulp.task('index-html', function() {
  gulp.src(player.app + '/index.html')
    .pipe(gulp.dest('dist/'));
  gulp.src(player.app + '/server.js')
    .pipe(gulp.dest('dist/'));
});

gulp.task('images', function() {
  return gulp.src([paths.images])
    .pipe($.cache($.imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(dist.path + dist.images));
});

gulp.task('build-js', function() {
  return gulp.src(paths.scripts)
    // .pipe(useref())
    .pipe(gulp.dest(dist.path + dist.scripts));
});

gulp.task('build-css', function() {
  return gulp.src(player.app + 'styles/main.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulp.dest(dist.path + dist.styles));
});
gulp.task('build-css-dev', function() {
  return gulp.src(player.app + 'styles/main.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulp.dest(player.app + 'styles'))
    .pipe(gulp.dest(player.public + 'styles'));
});

// inject bower components
gulp.task('bower', function() {
  return gulp.src(paths.thirdparty)
    .pipe(gulp.dest(dist.path + '/thirdparty'));
});

gulp.task('html', function() {
  return gulp.src(player.app + '/views/**/*')
    .pipe(gulp.dest(dist.path + dist.views));
});

gulp.task('watch', function() {
  gulp.watch('app/styles/**/main.less', ['build-css']);

  $.watch(paths.views.files)
    .pipe($.plumber())
    .pipe($.connect.reload());

  $.watch(paths.scripts)
    .pipe($.plumber())
    .pipe(lintScripts())
    .pipe($.connect.reload());

  $.watch(paths.test)
    .pipe($.plumber())
    .pipe(lintScripts());

  gulp.watch('bower.json', ['bower']);
});

// Below task is to clean up the portal coverage report
gulp.task('clean-coverage-portal', function(cb) {
  rimraf(paths.portalCoverage, cb);
});

gulp.task('inject-private-script', function(callback) {
  file(player.app + 'index.ejs', '<html><body></body></html>')
    .pipe(inject(gulp.src(player.app + '/**/*.js', { read: true }).pipe(angularFileSort()), {
      addRootSlash: false,
      name: 'fix-inject',
      starttag: '<body>',
      endtag: '</body>',
      transform: function(filePath, file, index, length) {
        console.log('filePath', filePath)
        private_js_files.push(filePath);
        if (index === length - 1) {
          callback();
        }
      }
    }));
});

gulp.task('inject-public-script', function(callback) {
  file(player.public + 'index.html', '<html><body></body></html>')
    .pipe(inject(gulp.src(player.public + '/**/*.js', { read: true }).pipe(angularFileSort()), {
      addRootSlash: false,
      name: 'fix-inject',
      starttag: '<body>',
      endtag: '</body>',
      transform: function(filePath, file, index, length) {
        public_js_files.push(filePath);
        if (index === length - 1) {
          callback();
        }
      }
    }));
});

gulp.task('run-test', ['start:server:test'], function() {
  var testToFiles = paths.testRequire.concat(private_js_files, public_js_files, paths.test);
  return gulp.src(testToFiles)
    .pipe($.karma({
      configFile: paths.karma,
      action: 'watch'
    }));
});

gulp.task('test', function(callback) {
  runSequence('clean-coverage-portal', 'inject-private-script', 'inject-public-script',
    'run-test', callback);
});

// /////////
// Build //
// /////////

gulp.task('client:build', ['html', 'build-css'], function() {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');

  return gulp.src(paths.views.main)
    .pipe($.useref({ searchPath: [player.app, '.tmp'] }))
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.minifyCss({ cache: true }))
    .pipe(cssFilter.restore())
    .pipe($.rev())
    .pipe($.revReplace())
    .pipe(gulp.dest(player.dist));
});

gulp.task('semantic', function() {
  gulp.src('semantic/dist', {
    read: false
  }).pipe(clean());
  gulp.src(['app/config/semantic/theme.config'])
    .pipe(gulp.dest('semantic/src/'));
  gulp.src(['app/config/semantic/site.variables'])
    .pipe(gulp.dest('semantic/src/site/globals/'));
  gulp.src('semantic/gulpfile.js')
    .pipe(chug({
      tasks: ['build']
    }, function() {
      gulp.src(['semantic/dist/semantic.min.css'])
        .pipe(gulp.dest('app/thirdparty/semantic/styles/'));
      gulp.src(['semantic/dist/themes/**/*'])
        .pipe(gulp.dest('app/thirdparty/semantic/styles/themes'));
      gulp.src(['semantic/dist/semantic.min.js'])
        .pipe(gulp.dest('app/thirdparty/semantic'));
    }));
});

gulp.task('build', function() {
  runSequence(['index-html',
    'images',
    'bower',
    'config',
    'build-css',
    'build-css-dev',
    'build-js',
    'html',
    'config-public-const'
  ]);
});

gulp.task('config', function() {
  jsonConfigArr.forEach(function(item) {
    gulp.src(player.app + item.path)
      .pipe(gulpNgConfig('playerApp.' + item.name))
      .pipe(gulp.dest(player.app + 'scripts'))
      .pipe(gulp.dest(dist.path + dist.scripts));
  });
});

gulp.task('config-public-const', function() {
  jsonConfigPublic.forEach(function(item) {
    gulp.src(player.public + item.path)
      .pipe(gulpNgConfig('loginApp.' + item.name))
      .pipe(gulp.dest(player.public + 'scripts'))
      .pipe(gulp.dest(dist.path + dist.scripts));
  });
});
