// Generated on 2017-05-10 using generator-angular 0.16.0
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var chug = require('gulp-chug');
var clean = require('gulp-clean');
var openURL = require('open');
var lazypipe = require('lazypipe');
var rimraf = require('rimraf');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var gulpNgConfig = require('gulp-ng-config');
var player = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
};

var paths = {
    scripts: [player.app + '/scripts/**/*.js'],
    styles: [player.app + '/styles/**/*.css'],
    test: ['test/spec/**/*.js'],
    testRequire: [
        player.app + '/thirdparty/bower_components/jquery/dist/jquery.js',
        player.app + '/thirdparty/bower_components/angular/angular.js',
        player.app + '/thirdparty/bower_components/angular-mocks/angular-mocks.js',
        player.app + '/thirdparty/bower_components/angular-resource/angular-resource.js',
        player.app + '/thirdparty/bower_components/angular-cookies/angular-cookies.js',
        player.app + '/thirdparty/bower_components/angular-sanitize/angular-sanitize.js',
        player.app + '/thirdparty/bower_components/angular-route/angular-route.js',
        'test/mock/**/*.js',
        'test/spec/**/*.js'
    ],
    karma: 'karma.conf.js',
    views: {
        main: player.app + '/index.html',
        files: [player.app + '/views/**/*.html']
    }
};

////////////////////////
// Reusable pipelines //
////////////////////////

var lintScripts = lazypipe()
    .pipe($.jshint, '.jshintrc')
    .pipe($.jshint.reporter, 'jshint-stylish');

var styles = lazypipe()
    .pipe($.autoprefixer, 'last 1 version')
    .pipe(gulp.dest, '.tmp/styles');

///////////
// Tasks //
///////////

gulp.task('styles', function() {
    return gulp.src(paths.styles)
        .pipe(styles());
});

gulp.task('lint:scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(lintScripts());
});

gulp.task('clean:tmp', function(cb) {
    rimraf('./.tmp', cb);
});

gulp.task('start:client', ['start:server', 'styles'], function() {
    openURL('http://localhost:9000');
});

gulp.task('start:server', function() {
    $.connect.server({
        root: [player.app, '.tmp'],
        livereload: true,
        // Change this to '0.0.0.0' to access the server from outside.
        port: 9000
    });
});
gulp.task('start:server:test', function() {
    $.connect.server({
        root: ['test', player.app, '.tmp'],
        livereload: true,
        port: 9001
    });
});

gulp.task('watch', function() {
    $.watch(paths.styles)
        .pipe($.plumber())
        .pipe(styles())
        .pipe($.connect.reload());

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

gulp.task('serve', function(cb) {
    runSequence('clean:tmp', ['lint:scripts'], ['start:client'],
        'watch', cb);
});

gulp.task('serve:prod', function() {
    $.connect.server({
        root: [player.dist],
        livereload: true,
        port: 9000
    });
});

gulp.task('test', ['start:server:test'], function() {
    var testToFiles = paths.testRequire.concat(paths.scripts, paths.test);
    return gulp.src(testToFiles)
        .pipe($.karma({
            configFile: paths.karma,
            action: 'watch'
        }));
});

// inject bower components
gulp.task('bower', function() {
    return gulp.src(paths.views.main)
        .pipe(wiredep({
            directory: '/thirdparty/bower_components',
            ignorePath: '..'
        }))
        .pipe(gulp.dest(player.app + '/views'));
});

///////////
// Build //
///////////

gulp.task('clean:dist', function(cb) {
    rimraf('./dist', cb);
});

gulp.task('client:build', ['html', 'styles'], function() {
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

gulp.task('html', function() {
    return gulp.src(player.app + '/views/**/*')
        .pipe(gulp.dest(player.dist + '/views'));
});

gulp.task('images', function() {
    return gulp.src(player.app + '/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(player.dist + '/images'));
});

gulp.task('copy:extras', function() {
    return gulp.src(player.app + '/*/.*', { dot: true })
        .pipe(gulp.dest(player.dist));
});

gulp.task('copy:fonts', function() {
    return gulp.src(player.app + '/fonts/**/*')
        .pipe(gulp.dest(player.dist + '/fonts'));
});
gulp.task('semantic', function() {
    gulp.src('semantic/dist', {
        read: false
    }).pipe(clean());
    gulp.src(['app/config/semantic/theme.config']).pipe(gulp.dest('semantic/src/'));
    gulp.src(['app/config/semantic/site.variables']).pipe(gulp.dest('semantic/src/site/globals/'));
    gulp.src('semantic/gulpfile.js')
        .pipe(chug({
            tasks: ['build']
        }, function() {
            gulp.src(['semantic/dist/semantic.min.css']).pipe(gulp.dest('app/thirdparty/semantic/styles/'));
            gulp.src(['semantic/dist/themes/**/*']).pipe(gulp.dest('app/thirdparty/semantic/styles/themes'));
            gulp.src(['semantic/dist/semantic.min.js']).pipe(gulp.dest('app/thirdparty/semantic'));
        }));
});

gulp.task('build', ['clean:dist'], function() {
    runSequence(['images', 'copy:extras', 'copy:fonts']);
});

gulp.task('default', ['build']);

gulp.task('config', function () {
  gulp.src('app/config/playerAppConfig.json')
  .pipe(gulpNgConfig('playerApp.config'))
  .pipe(gulp.dest('app/scripts'))
});