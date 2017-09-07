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
var minifyHTML = require('gulp-minify-html');
var minify = require('gulp-minifier');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var merge = require('merge-stream');
var gzip = require('gulp-gzip');
var map = require('map-stream');

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
    thirdparty: [player.app + '/thirdparty/**/*.js',
        player.app + '/thirdparty/**/**/**/*.css',
        player.app + '/thirdparty/**/**/**/**/*.*'],

    testRequire: [
        player.app + '/thirdparty/bower_components/jquery/dist/jquery.js',
        player.app + '/thirdparty/bower_components/jasmine-jquery/lib/jasmine-jquery.js',
        player.app + '/thirdparty/bower_components/angular/angular.js',
        player.app + '/thirdparty/bower_components/angular-mocks/angular-mocks.js',
        player.app + '/thirdparty/bower_components/angular-cookies/angular-cookies.js',
        player.app + '/thirdparty/bower_components/angular-route/angular-route.js',
        player.app + '/thirdparty/bower_components/angular-ui-router/release/angular-ui-router.min.js',// eslint-disable-line
        player.app + '/thirdparty/semantic/semantic.min.js',
        player.app + '/thirdparty/bower_components/ngstorage/ngStorage.js',
        player.app + '/thirdparty/bower_components/moment/min/moment-with-locales.min.js',
        player.app + '/thirdparty/bower_components/angular-pagedown/angular-pagedown.min.js',// eslint-disable-line
        player.app + '/thirdparty/bower_components/pagedown/Markdown.Converter.js',
        player.app + '/thirdparty/bower_components/pagedown/Markdown.Sanitizer.js',
        player.app + '/thirdparty/bower_components/pagedown/Markdown.Extra.js',
        player.app + '/thirdparty/bower_components/pagedown/Markdown.Editor.js',
        player.app + '/thirdparty/bower_components/angular-slick/dist/slick.js',
        player.app + '/thirdparty/bower_components/slick-carousel/slick/slick.js',
        player.app + '/thirdparty/bower_components/angular-translate/angular-translate.js',// eslint-disable-line
        player.app + '/thirdparty/bower_components/angular-sanitize/angular-sanitize.js',
        player.app + '/thirdparty/bower_components/semantic-tree-picker/semantic-ui-tree-picker.js',// eslint-disable-line
        player.app + '/thirdparty/bower_components/angular-ui-router/release/stateEvents.min.jss',// eslint-disable-line
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
    { name: 'config', path: 'config/publicAppConfig.json' },
    { name: 'labels', path: 'config/publicLabels.json' },
    { name: 'errorMessages', path: 'config/publicErrorMessages.json' }
];

var public_bower_js = [
    "dist/thirdparty/libs/eventbus.min.js",
    "dist/thirdparty/bower_components/jquery/dist/jquery.min.js",
    "dist/thirdparty/bower_components/jquery-ui/jquery-ui.min.js",
    "dist/thirdparty/bower_components/angular/angular.min.js",
    "dist/thirdparty/bower_components/angular-cookies/angular-cookies.min.js",
    "dist/thirdparty/bower_components/angular-route/angular-route.min.js",
    "dist/thirdparty/bower_components/angular-ui-router/release/angular-ui-router.min.js",
    "dist/thirdparty/bower_components/semantic-ui-calendar/dist/calendar.min.js",
    "dist/thirdparty/bower_components/izitoast/dist/js/iziToast.min.js",
    "dist/thirdparty/bower_components/angular-uuid4/angular-uuid4.min.js",
    "dist/thirdparty/bower_components/lodash/lodash.js",
    "dist/thirdparty/bower_components/moment/min/moment-with-locales.min.js",
    "dist/thirdparty/bower_components/angular-sanitize/angular-sanitize.min.js",
    "dist/thirdparty/bower_components/jquery.fancytree/dist/jquery.fancytree.min.js"
];

var public_bower_css = [
    "dist/thirdparty/bower_components/semantic-ui-calendar/dist/calendar.min.css",
    "dist/thirdparty/bower_components/izitoast/dist/css/iziToast.min.css",
];

var public_scripts = [
    "dist/public/scripts/service/httpService.js",
    "dist/public/scripts/service/signUpService.js",
    "dist/public/scripts/service/toasterService.js",
    "dist/public/scripts/service/publicPlayerTelemetryUtilsService.js",
    "dist/public/scripts/service/contentService.js",
    "dist/public/scripts/directive/error.js",
    "dist/public/scripts/directive/loader.js",
    "dist/public/scripts/directive/courseDiscussions.js",
    "dist/public/scripts/directive/applyScript.js",
    "dist/public/scripts/directive/publicContentPlayer.js",
    "dist/public/scripts/controllers/signUpController.js",
    "dist/public/scripts/controllers/publicContentPlayerController.js",
    "dist/public/scripts/controllers/courseScheduleController.js",
    "dist/public/scripts/controllers/collectionPlayerController.js",
    "dist/public/scripts/filters/dateFilter.js"
];

var private_bower_js = [
    "dist/thirdparty/libs/eventbus.min.js",
    "dist/thirdparty/libs/md5.js",
    "dist/thirdparty/bower_components/jquery/dist/jquery.min.js",
    "dist/thirdparty/bower_components/jquery-ui/jquery-ui.min.js",
    "dist/thirdparty/bower_components/angular/angular.min.js",
    "dist/thirdparty/bower_components/angular-cookies/angular-cookies.min.js",
    "dist/thirdparty/bower_components/angular-route/angular-route.min.js",
    "dist/thirdparty/bower_components/semantic-ui-calendar/dist/calendar.min.js",
    "dist/thirdparty/bower_components/angular-ui-router/release/angular-ui-router.min.js",
    "dist/thirdparty/bower_components/angular-ui-router/release/stateEvents.min.js",
    "dist/thirdparty/libs/semantic-ui-tree-picker/semantic-ui-tree-picker.js",
    "dist/thirdparty/bower_components/ngstorage/ngStorage.min.js",
    "dist/thirdparty/bower_components/moment/min/moment-with-locales.min.js",
    "dist/thirdparty/bower_components/angular-pagedown/angular-pagedown.min.js",
    "dist/thirdparty/bower_components/pagedown/Markdown.Converter.js",
    "dist/thirdparty/bower_components/pagedown/Markdown.Sanitizer.js",
    "dist/thirdparty/bower_components/pagedown/Markdown.Extra.js",
    "dist/thirdparty/bower_components/pagedown/Markdown.Editor.js",
    "dist/thirdparty/bower_components/slick-carousel/slick/slick.min.js",
    "dist/thirdparty/bower_components/angular-sanitize/angular-sanitize.min.js",
    "dist/thirdparty/bower_components/izimodal/js/iziModal.min.js",
    "dist/thirdparty/bower_components/jquery.fancytree/dist/jquery.fancytree.min.js",
    "dist/thirdparty/bower_components/lodash/dist/lodash.min.js",
    "dist/thirdparty/bower_components/angular-uuid4/angular-uuid4.min.js",
    "dist/thirdparty/bower_components/js-md5/build/md5.min.js",
    "dist/thirdparty/bower_components/izitoast/dist/js/iziToast.min.js",
    "dist/thirdparty/bower_components/chart.js/dist/Chart.min.js",
    "dist/thirdparty/bower_components/angular-chart.js/dist/angular-chart.min.js",
    "dist/thirdparty/semantic-tree-picker/semantic-ui-tree-picker.js",
    "dist/thirdparty/libs/generateAndDownloadCSV.min.js"
];

var private_bower_css = [
    "dist/thirdparty/libs/semantic-ui-tree-picker/semantic-ui-tree-picker.css",
    "dist/thirdparty/bower_components/izimodal/css/iziModal.min.css",
    "dist/thirdparty/bower_components/semantic-ui-calendar/dist/calendar.min.css",
    "dist/thirdparty/bower_components/izitoast/dist/css/iziToast.min.css"
];

var private_scripts = [
    "dist/private/scripts/factories/sessionFactory.js",
    "dist/private/scripts/services/httpService.js",
    "dist/private/scripts/services/httpServiceJava.js",
    "dist/private/scripts/services/contentService.js",
    "dist/private/scripts/services/noteService.js",
    "dist/private/scripts/services/courseService.js",
    "dist/private/scripts/services/learnService.js",
    "dist/private/scripts/services/userService.js",
    "dist/private/scripts/services/pageSectionService.js",
    "dist/private/scripts/services/searchService.js",
    "dist/private/scripts/services/permissionsService.js",
    "dist/private/scripts/services/playerTelemetryUtilsService.js",
    "dist/private/scripts/services/contentStateService.js",
    "dist/private/scripts/services/portalTelemetryService.js",
    "dist/private/scripts/services/toasterService.js",
    "dist/private/scripts/services/routeHelperService.js",
    "dist/private/scripts/services/formValidation.js",
    "dist/private/scripts/services/adminService.js",
    "dist/private/scripts/services/batchService.js",
    "dist/private/scripts/services/workSpaceUtilsService.js",
    "dist/private/scripts/services/dashboardService.js",
    "dist/private/scripts/services/dataService.js",
    "dist/private/scripts/services/paginationService.js",
    "dist/private/scripts/controllers/searchController.js",
    "dist/private/scripts/controllers/appController.js",
    "dist/private/scripts/controllers/note/noteListController.js",
    "dist/private/scripts/controllers/courseScheduleController.js",
    "dist/private/scripts/controllers/learnController.js",
    "dist/private/scripts/controllers/resourceController.js",
    "dist/private/scripts/controllers/communityController.js",
    "dist/private/scripts/controllers/homeController.js",
    "dist/private/scripts/controllers/profileController.js",
    "dist/private/scripts/controllers/contentPlayer.js",
    "dist/private/scripts/controllers/note/noteCardController.js",
    "dist/private/scripts/controllers/contentPlayerController.js",
    "dist/private/scripts/controllers/workspace/createLessonController.js",
    "dist/private/scripts/controllers/workspace/draftContentController.js",
    "dist/private/scripts/controllers/workspace/reviewContentController.js",
    "dist/private/scripts/controllers/workspace/publishedContentController.js",
    "dist/private/scripts/controllers/workspace/allUploadedContentController.js",
    "dist/private/scripts/controllers/contentEditorController.js",
    "dist/private/scripts/controllers/collectionEditorController.js",
    "dist/private/scripts/controllers/genericEditorController.js",
    "dist/private/scripts/controllers/workspace/TextBookController.js",
    "dist/private/scripts/controllers/workspace/CollectionController.js",
    "dist/private/scripts/controllers/workspace/previewContentController.js",
    "dist/private/scripts/controllers/workspace/upForReviewContentController.js",
    "dist/private/scripts/controllers/collectionPlayerController.js",
    "dist/private/scripts/controllers/pageSectionController.js",
    "dist/private/scripts/controllers/workspace/CourseController.js",
    "dist/private/scripts/controllers/admin/adminController.js",
    "dist/private/scripts/controllers/common/contentFlagController.js",
    "dist/private/scripts/controllers/workspace/flaggedContentController.js",
    "dist/private/scripts/controllers/batch/batchListController.js",
    "dist/private/scripts/controllers/batch/batchController.js",
    "dist/private/scripts/controllers/batch/batchUpdateController.js",
    "dist/private/scripts/controllers/workspace/createLessonPlanController.js",
    "dist/private/scripts/controllers/dashboard/orgDashboardController.js",
    "dist/private/scripts/controllers/common/contentSharingController.js",
    "dist/private/scripts/controllers/dashboard/orgDashboardController.js",
    "dist/private/scripts/controllers/search/publicProfileController.js",
    "dist/private/scripts/controllers/dashboard/courseDashboardController.js",
    "dist/private/scripts/controllers/dashboard/courseCreatorDashboardController.js",
    "dist/private/scripts/controllers/admin/bulkUploadController.js",
    "dist/private/scripts/filters/dateFilter.js",
    "dist/private/scripts/filters/noteListFilter.js",
    "dist/private/scripts/directives/applyScript.js",
    "dist/private/scripts/directives/appLoader.js",
    "dist/private/scripts/directives/errorMessage.js",
    "dist/private/scripts/directives/contentPlayer.js",
    "dist/private/scripts/directives/angular-translate.js",
    "dist/private/scripts/directives/noteCardDirective.js",
    "dist/private/scripts/directives/courseDiscussions.js",
    "dist/private/scripts/directives/slickDirective.js",
    "dist/private/scripts/directives/addNoteDirective.js",
    "dist/private/scripts/directives/permissionsDirective.js",
    "dist/private/scripts/directives/pageSectionDirective.js",
    "dist/private/scripts/directives/searchDirective.js",
    "dist/private/scripts/directives/contentFlagDirective.js",
    "dist/private/scripts/directives/batchCardDirective.js",
    "dist/private/scripts/directives/conceptPicker.js",
    "dist/private/scripts/directives/admin/searchedUser.js",
    "dist/private/scripts/directives/admin/bulkUpload.js",
    "dist/private/scripts/directives/batchDetailsDirective.js",
    "dist/private/scripts/directives/contentSharingDirective.js"
];

var telemetry_js = [
    "dist/private/scripts/telemetry/TelemetryEvent.js",
    "dist/private/scripts/telemetry/TelemetryService.js",
    "dist/private/scripts/telemetry/TelemetryV2Manager.js",
    "dist/private/scripts/telemetry/TelemetryServiceUtil.js",
    "dist/private/scripts/telemetry/InActiveEvent.js"
];

// //////////////////////
// Reusable pipelines //
// //////////////////////

var lintScripts = lazypipe()
    .pipe($.jshint, '.jshintrc')
    .pipe($.jshint.reporter, 'jshint-stylish');

// /////////
// Tasks //
// /////////

gulp.task('index-html', function () {
    gulp.src(player.app + '/index.html')
        .pipe(gulp.dest('dist/'));
    gulp.src(player.app + '/server.js')
        .pipe(gulp.dest('dist/'));
});

gulp.task('images', function () {
    return gulp.src([paths.images])
        .pipe($.cache($.imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(dist.path + dist.images));
});

gulp.task('build-js', function () {
    return gulp.src(paths.scripts)
        // .pipe(useref())
        .pipe(gulp.dest(dist.path + dist.scripts));
});

gulp.task('build-css', function () {
    return gulp.src(player.app + 'styles/main.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulp.dest(dist.path + dist.styles));
});
gulp.task('build-css-dev', function () {
    return gulp.src(player.app + 'styles/main.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulp.dest(player.app + 'styles'))
        .pipe(gulp.dest(player.public + 'styles'));
});

// inject bower components
gulp.task('bower', function () {
    return gulp.src(paths.thirdparty)
        .pipe(gulp.dest(dist.path + '/thirdparty'));
});

gulp.task('html', function () {
    return gulp.src(player.app + '/views/**/*')
        .pipe(gulp.dest(dist.path + dist.views));
});

gulp.task('start:client', ['build-css', 'start:server'], function () {
    openURL('http://localhost:9000');
});

gulp.task('start:server', function () {
    $.connect.server({
        root: [player.app, '.tmp'],
        livereload: true,
        // Change this to '0.0.0.0' to access the server from outside.
        port: 9000,
        middleware: function () {
            return [historyApiFallback({})];
        }
    });
});
gulp.task('start:server:test', function () {
    $.connect.server({
        root: ['test', player.app, '.tmp'],
        livereload: true,
        port: 9001
    });
});

gulp.task('watch', function () {
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

gulp.task('serve', function (cb) {
    runSequence('clean:dist', ['start:client'], ['build-css-dev'],
        'watch', cb);
});

gulp.task('serve:prod', function (cb) {
    runSequence('clean:dist', ['build'], cb);
    $.connect.server({
        root: [player.app, 'dist'],
        livereload: false,
        port: 9000,
        middleware: function () {
            return [historyApiFallback({})];
        }
    });
    openURL('http://localhost:9000');
});

gulp.task('test', ['start:server:test'], function () {
    var testToFiles = paths.testRequire.concat(paths.scripts, paths.test);
    return gulp.src(testToFiles)
        .pipe($.karma({
            configFile: paths.karma,
            action: 'watch'
        }));
});

// /////////
// Build //
// /////////

gulp.task('clean:dist', function (cb) {
    rimraf(dist.path, cb);
});

gulp.task('client:build', ['html', 'build-css'], function () {
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

gulp.task('semantic', function () {
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
        }, function () {
            gulp.src(['semantic/dist/semantic.min.css'])
            .pipe(gulp.dest('app/thirdparty/semantic/styles/'));
            gulp.src(['semantic/dist/themes/**/*'])
            .pipe(gulp.dest('app/thirdparty/semantic/styles/themes'));
            gulp.src(['semantic/dist/semantic.min.js'])
            .pipe(gulp.dest('app/thirdparty/semantic'));
        }));
});

gulp.task('build', ['clean:dist'], function () {
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

gulp.task('production', ['clean:dist'], function () {
    return gulp.src(['app/**/*'])
        .pipe(gulp.dest(player.dist));
});

gulp.task('minifyJS', ['production'], function() {
    return gulp.src(['dist/private/**/*.js', 
            'dist/public/**/*.js', 
            'dist/thirdparty/libs/semantic-ui-tree-picker/semantic-ui-tree-picker.js',
            'dist/thirdparty/bower_components/pagedown/Markdown.Converter.js',
            'dist/thirdparty/bower_components/pagedown/Markdown.Sanitizer.js',
            'dist/thirdparty/bower_components/pagedown/Markdown.Editor.js',
            '!dist/public/**/publicAppRoute.js',  
            '!dist/private/**/appRoute.js',], {base: "dist/"}).pipe(minify({
        minify: true,
        collapseWhitespace: true,
        minifyJS: true
    })).pipe(gulp.dest('dist'));
});

gulp.task('minifyCSS', ['minifyJS'], function() {
    return gulp.src(['dist/private/styles/**/*.css', 'dist/public/styles/**/*.css'], {base: "dist/"}).pipe(minify({
        minify: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        minifyCSS: true
    })).pipe(gulp.dest('dist'));
});

gulp.task('minifyThirdparty', ['minifyCSS'], function() {
    var publicBowerJs = gulp.src(public_bower_js).pipe(concat('external.min.js')).pipe(gulp.dest('dist/public/'));
    var publicBowerCss = gulp.src(public_bower_css).pipe(concat('external.min.css')).pipe(gulp.dest('dist/public/'));
    var privateBowerJs = gulp.src(private_bower_js).pipe(concat('external.min.js')).pipe(gulp.dest('dist/private/'));
    var privateBowerCss = gulp.src(private_bower_css).pipe(concat('external.min.css')).pipe(gulp.dest('dist/private/'));
    var privateScripts = gulp.src(private_scripts).pipe(concat('script.min.js')).pipe(gulp.dest('dist/private/'));
    var publicScripts = gulp.src(public_scripts).pipe(concat('script.min.js')).pipe(gulp.dest('dist/public/'));
    var telemetry = gulp.src(telemetry_js).pipe(concat('telemetry.min.js')).pipe(gulp.dest('dist/public/'));
    return merge(publicBowerJs, publicBowerCss, privateBowerJs, privateBowerCss, privateScripts, publicScripts, telemetry);
});

// gulp.task('deploy_private_config', ['minifyThirdparty'], function () {
//     gulp.src('dist/deploy/playerAppConfig.json')
//         .pipe(gulpNgConfig('playerApp.config'))
//         .pipe(gulp.dest(dist.path  + 'private/' + dist.scripts));
// });

// gulp.task('deploy_public_config', ['deploy_private_config'], function () {
//     gulp.src('dist/deploy/publicAppConfig.json')
//         .pipe(gulpNgConfig('loginApp.config'))
//         .pipe(gulp.dest(dist.path + 'public/' + dist.scripts));
// });

gulp.task('minifyHTML', ['minifyThirdparty'], function() {
    var opts = { empty: true, comments:false, spare:false };
    return gulp.src(['dist/private/views/**/*.html', 'dist/public/views/**/*.html'], {base: "dist/"})
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('dist'))
});
gulp.task('minifyIMG', ['minifyHTML'], function(){
    gulp.src('dist/private/images/*', {base: "dist/"})
        .pipe(imagemin())
        .pipe(gulp.dest('dist'))
});

gulp.task('injectFiles', ['minifyIMG'], function() {
    var x = gulp.src('dist/public/index.html')
            .pipe(inject(gulp.src(["dist/public/external.min.js", 
                "dist/thirdparty/semantic/semantic.min.js", 
                "dist/private/scripts/utils/util.js",
                "dist/private/scripts/managers/eventManager.js",
                "dist/public/scripts/org.js",
                "dist/public/telemetry.min.js",
                "dist/public/scripts/publicLabels.js",
                "dist/public/scripts/publicErrorMessages.js",
                "dist/public/scripts/publicAppConfig.js",
                "dist/public/scripts/application.js",
                "dist/public/scripts/routes/publicAppRoute.js",
                "dist/public/script.min.js", 
                "dist/public/external.min.css"], { read: false }), { ignorePath: '/dist', addRootSlash: true }))
            .pipe(gulp.dest('dist/public/'));
    var y = gulp.src('dist/private/index.ejs')
            .pipe(inject(gulp.src(["dist/private/external.min.js", 
                "dist/thirdparty/semantic/semantic.min.js",
                "dist/private/scripts/utils/util.js",
                "dist/public/telemetry.min.js",
                "dist/private/scripts/playerAppConfig.js",
                "dist/private/scripts/privateLabels.js",
                "dist/private/scripts/privateErrorMessages.js",
                "dist/private/scripts/managers/eventManager.js",
                "dist/private/scripts/app.js",
                "dist/private/scripts/routes/appRoute.js",
                "dist/private/script.min.js", 
                "dist/private/external.min.css"], { read: false }), { ignorePath: '/dist', addRootSlash: true }))
            .pipe(gulp.dest('dist/private/'));
    return merge(x, y);
});

gulp.task('compress', ['injectFiles'], function() {
    gulp.src(["dist/**"], {base: "dist/"})
    .pipe(gzip())
    .pipe(gulp.dest('dist'));
});

gulp.task('inject_staticGzip', ['compress'], function() {
  return gulp.src('dist/server.js')
    .pipe(map(function(file, cb) {
      var fileContents = file.contents.toString();
      fileContents = fileContents.replace('\/(invalid)\/', '/(\.html|\.js|\.css)$/');
      file.contents = new Buffer(fileContents);
      cb(null, file);
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('packageNodeModules', ['injectFiles'], function(){
    return gulp.src(['node_modules/**/*'])
        .pipe(gulp.dest(player.dist + '/node_modules'));
});
gulp.task('default', ['packageNodeModules']);

gulp.task('config', function () {
    jsonConfigArr.forEach(function (item) {
        gulp.src(player.app + item.path)
            .pipe(gulpNgConfig('playerApp.' + item.name))
            .pipe(gulp.dest(player.app + 'scripts'))
            .pipe(gulp.dest(dist.path + dist.scripts));
    });
});

gulp.task('config-public-const', function () {
    jsonConfigPublic.forEach(function (item) {
        gulp.src(player.public + item.path)
            .pipe(gulpNgConfig('loginApp.' + item.name))
            .pipe(gulp.dest(player.public + 'scripts'))
            .pipe(gulp.dest(dist.path + dist.scripts));
    });
});
