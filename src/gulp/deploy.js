var gulp = require('gulp')
var minify = require('gulp-minifier')
var rimraf = require('rimraf')
var paths = require('./paths.js')
var concat = require('gulp-concat')
var merge = require('merge-stream')
var minifyHTML = require('gulp-minify-html')
var imagemin = require('gulp-imagemin')
var inject = require('gulp-inject')

gulp.task('addCDNFiles', ['injectFiles'], function () {
  return gulp
    .src(paths.cdnFiles, {base: 'dist/'})
    .pipe(gulp.dest(paths.cdnDest))
})

gulp.task('injectFiles', ['minifyIMG'], function () {
  var x = gulp.src('dist/public/index.ejs')
    .pipe(inject(gulp.src(['dist/public/external.min.js',
      'dist/thirdparty/semantic/semantic.min.js',
      'dist/private/scripts/utils/util.js',
      'dist/private/scripts/managers/eventManager.js',
      'dist/public/scripts/org.js',
      'dist/public/telemetry.min.js',
      'dist/public/scripts/publicLabels.js',
      'dist/public/scripts/publicErrorMessages.js',
      'dist/public/scripts/publicAppConfig.js',
      'dist/public/scripts/application.js',
      'dist/public/scripts/routes/publicAppRoute.js',
      'dist/public/script.min.js',
      'dist/public/external.min.css'
    ], { read: false }), { ignorePath: '/dist', addRootSlash: true }))
    .pipe(gulp.dest('dist/public/'))
  var y = gulp.src('dist/private/index.ejs')
    .pipe(inject(gulp.src(['dist/private/external.min.js',
      'dist/thirdparty/semantic/semantic.min.js',
      'dist/private/scripts/utils/util.js',
      'dist/public/telemetry.min.js',
      'dist/private/scripts/playerAppConfig.js',
      'dist/private/scripts/privateLabels.js',
      'dist/private/scripts/privateErrorMessages.js',
      'dist/private/scripts/managers/eventManager.js',
      'dist/private/scripts/app.js',
      'dist/private/scripts/routes/appRoute.js',
      'dist/private/script.min.js',
      'dist/private/external.min.css',
      'dist/private/scripts/routes/announcementRoute.js'
    ], { read: false }), { ignorePath: '/dist', addRootSlash: true }))
    .pipe(gulp.dest('dist/private/'))
  return merge(x, y)
})

gulp.task('minifyIMG', ['minifyHTML'], function () {
  gulp.src('common/images/*', { base: 'dist/' })
    .pipe(imagemin())
    .pipe(gulp.dest('dist'))
})

gulp.task('minifyHTML', ['minifyThirdparty'], function () {
  var opts = { empty: true, comments: false, spare: false }
  return gulp.src(['dist/private/views/**/*.html', 'dist/public/views/**/*.html'], { base: 'dist/' })
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('dist'))
})

gulp.task('minifyThirdparty', ['minifyCSS'], function () {
  var publicBowerJs = gulp.src(paths.public_bower_js).pipe(concat('external.min.js')).pipe(gulp.dest('dist/public/'))
  var publicBowerCss = gulp.src(paths.public_bower_css).pipe(concat('external.min.css')).pipe(gulp.dest('dist/public/'))
  var privateBowerJs = gulp.src(paths.private_bower_js).pipe(concat('external.min.js')).pipe(gulp.dest('dist/private/'))
  var privateBowerCss = gulp.src(paths.private_bower_css).pipe(concat('external.min.css')).pipe(gulp.dest('dist/private/'))
  var privateScripts = gulp.src(paths.private_scripts).pipe(concat('script.min.js')).pipe(gulp.dest('dist/private/'))
  var publicScripts = gulp.src(paths.public_scripts).pipe(concat('script.min.js')).pipe(gulp.dest('dist/public/'))
  var telemetry = gulp.src(paths.telemetry_js).pipe(concat('telemetry.min.js')).pipe(gulp.dest('dist/public/'))
  return merge(publicBowerJs, publicBowerCss, privateBowerJs, privateBowerCss, privateScripts, publicScripts, telemetry)
})

gulp.task('minifyCSS', ['minifyJS'], function () {
  return gulp.src(['dist/common/styles/**/*.css'], { base: 'dist/' }).pipe(minify({
    minify: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyCSS: true
  })).pipe(gulp.dest('dist'))
})

gulp.task('minifyJS', ['production'], function () {
  return gulp.src(['dist/private/**/*.js',
    'dist/public/**/*.js',
    'dist/thirdparty/libs/semantic-ui-tree-picker/semantic-ui-tree-picker.js',
    'dist/thirdparty/bower_components/pagedown/Markdown.Converter.js',
    'dist/thirdparty/bower_components/pagedown/Markdown.Sanitizer.js',
    'dist/thirdparty/bower_components/pagedown/Markdown.Editor.js',
    '!dist/public/**/publicAppRoute.js',
    '!dist/private/**/appRoute.js',
    '!dist/private/**/announcementRoute.js'
  ], { base: 'dist/' }).pipe(minify({
    minify: true,
    collapseWhitespace: true,
    minifyJS: true
  })).pipe(gulp.dest('dist'))
})

gulp.task('production', ['clean:dist'], function () {
  return gulp.src(['app/**/*'])
    .pipe(gulp.dest(paths.player.dist))
})

gulp.task('clean:dist', function (cb) {
  rimraf(paths.dist.path, cb)
})

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

// gulp.task('compress', ['injectFiles'], function () {
//   gulp.src(['dist/**'], { base: 'dist/' })
//     .pipe(gzip())
//     .pipe(gulp.dest('dist'))
// })

// gulp.task('inject_staticGzip', ['compress'], function () {
//   return gulp.src('dist/server.js')
//     .pipe(map(function (file, cb) {
//       var fileContents = file.contents.toString()
//       fileContents = fileContents.replace('\/(invalid)\/', '/(\.html|\.js|\.css)$/')
//       file.contents = new Buffer(fileContents)
//       cb(null, file)
//     }))
//     .pipe(gulp.dest('dist'))
// })
