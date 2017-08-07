// Generated on 2017-05-10 using generator-angular 0.16.0
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var chug = require('gulp-chug');
var clean = require('gulp-clean');
var openURL = require('open');
var lazypipe = require('lazypipe');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var gulpNgConfig = require('gulp-ng-config');
var less = require('gulp-less');
var historyApiFallback = require('connect-history-api-fallback');
var jeditor = require('gulp-json-editor');

var useref = require('gulp-useref');

var player = {
    app: 'app/private/',
    public: 'app/public/',
    dist: 'dist'
};

var paths = {
    scripts: [player.app + '/scripts/*.js', player.app + '/scripts/**/*.js'],
    styles: [player.app + 'app/styles/**/main.less'],
    images: player.app + '/images/*.*',
    test: ['test/spec/**/*.js'],
    thirdparty: [player.app + '/thirdparty/**/*.js', player.app + '/thirdparty/**/**/**/*.css', player.app + '/thirdparty/**/**/**/**/*.*'],

    testRequire: [
        player.app + '/thirdparty/bower_components/jquery/dist/jquery.js',
        player.app + '/thirdparty/bower_components/jasmine-jquery/lib/jasmine-jquery.js',

        player.app + '/thirdparty/bower_components/angular/angular.js',
        player.app + '/thirdparty/bower_components/angular-mocks/angular-mocks.js',
        player.app + '/thirdparty/bower_components/angular-cookies/angular-cookies.js',
        player.app + '/thirdparty/bower_components/angular-route/angular-route.js',
        player.app + '/thirdparty/bower_components/angular-ui-router/release/angular-ui-router.min.js',

        player.app + '/thirdparty/semantic/semantic.min.js',
        player.app + '/thirdparty/bower_components/video.js/dist/video.js',
        player.app + '/thirdparty/bower_components/videojs-youtube/dist/Youtube.js',
        player.app + '/thirdparty/bower_components/ngstorage/ngStorage.js',
        player.app + '/thirdparty/bower_components/moment/min/moment-with-locales.min.js',

        player.app + '/thirdparty/bower_components/angular-pagedown/angular-pagedown.min.js',
        player.app + '/thirdparty/bower_components/pagedown/Markdown.Converter.js',
        player.app + '/thirdparty/bower_components/pagedown/Markdown.Sanitizer.js',
        player.app + '/thirdparty/bower_components/pagedown/Markdown.Extra.js',
        player.app + '/thirdparty/bower_components/pagedown/Markdown.Editor.js',
        player.app + '/thirdparty/bower_components/angular-slick/dist/slick.js',
        player.app + '/thirdparty/bower_components/slick-carousel/slick/slick.js',
        player.app + '/thirdparty/bower_components/pdfjs-dist/build/pdf.js',
        player.app + '/thirdparty/bower_components/angular-pdf-viewer/dist/angular-pdf-viewer.min.js',
        player.app + '/thirdparty/bower_components/angular-translate/angular-translate.js',
        player.app + '/thirdparty/bower_components/angular-sanitize/angular-sanitize.js',

        player.app + '/thirdparty/bower_components/file-upload/fine-uploader/fine-uploader.js',
        player.app + '/thirdparty/bower_components/semantic-tree-picker/semantic-ui-tree-picker.js',
        player.app + '/thirdparty/bower_components/angular-ui-router/release/stateEvents.min.jss',
        player.app + '/thirdparty/bower_components/izitoast/dist/js/iziToast.min.js'


    ],
    karma: 'karma.conf.js',
    views: {
        main: player.app + '/index.html',
        files: [player.app + '/views/**/*.html']
    }
};

var dist = {
    path: 'dist/',
    images: 'images/',
    scripts: 'scripts/',
    styles: 'styles',
    views: 'views',
    config: 'config/'
};

var jsonConfigArr = [
    { name: 'config', path: 'config/playerAppConfig.json' },
    { name: 'labels', path: 'config/privateLabels.json' },
    { name: 'errorMessages', path: 'config/privateErrorMessages.json' }
];

var jsonConfigPublic = [
    { name: 'labels', path: 'config/publicLabels.json' },
    { name: 'errorMessages', path: 'config/publicErrorMessages.json' }
];

////////////////////////
// Reusable pipelines //
////////////////////////

var lintScripts = lazypipe()
    .pipe($.jshint, '.jshintrc')
    .pipe($.jshint.reporter, 'jshint-stylish');

///////////
// Tasks //
///////////

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

gulp.task('start:client', ['build-css', 'start:server'], function() {
    openURL('http://localhost:9000');
});

gulp.task('start:server', function() {
    $.connect.server({
        root: [player.app, '.tmp'],
        livereload: true,
        // Change this to '0.0.0.0' to access the server from outside.
        port: 9000,
        middleware: function(connect, opt) {
            return [historyApiFallback({})];
        }
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

gulp.task('serve', function(cb) {
    runSequence('clean:dist', ['start:client'], ['build-css-dev'],
        'watch', cb);
});

gulp.task('serve:prod', function(cb) {
    runSequence('clean:dist', ['build'], cb);
    $.connect.server({
        root: [player.app, 'dist'],
        livereload: false,
        port: 9000,
        middleware: function(connect, opt) {
            return [historyApiFallback({})];
        }
    });
    openURL('http://localhost:9000');
});

gulp.task('test', ['start:server:test'], function() {
    var testToFiles = paths.testRequire.concat(paths.scripts, paths.test);
    return gulp.src(testToFiles)
        .pipe($.karma({
            configFile: paths.karma,
            action: 'watch'
        }));
});

///////////
// Build //
///////////

gulp.task('clean:dist', function(cb) {
    rimraf(dist.path, cb);
});

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
    runSequence(['index-html', 'images', 'bower', 'config', 'build-css', 'build-css-dev', 'build-js', 'html', 'config-public-const']);
});

gulp.task('production', ['clean:dist'], function() {
    gulp.src(['app/**/*'])
        .pipe(gulp.dest(player.dist));
    gulp.src(['node_modules/**/*'])
        .pipe(gulp.dest(player.dist + '/node_modules'));
});
gulp.task('default', ['production']);

gulp.task('config', function() {
    jsonConfigArr.forEach(function(item, index) {
        gulp.src(player.app + item.path)
            .pipe(gulpNgConfig('playerApp.' + item.name))
            .pipe(gulp.dest(player.app + 'scripts'))
            .pipe(gulp.dest(dist.path + dist.scripts));
    });
});
gulp.task('config-public-const', function() {
    jsonConfigPublic.forEach(function(item, index) {
        gulp.src(player.public + item.path)
            .pipe(gulpNgConfig('loginApp.' + item.name))
            .pipe(gulp.dest(player.public + 'scripts'))
            .pipe(gulp.dest(dist.path + dist.scripts));
    });
});