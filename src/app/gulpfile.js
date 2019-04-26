const gulp = require('gulp')
const download = require('gulp-download')
const decompress = require('gulp-decompress')
const rename = require('gulp-rename')
const clean = require('gulp-clean')
const gulpSequence = require('gulp-sequence')
const gzip = require('gulp-gzip')
const exec = require('child_process').exec
const brotli = require('gulp-brotli');

// To download editors
const contentEditor = 'https://sunbirdpublic.blob.core.windows.net/sunbird-public-dev/artefacts/editor/content-editor-iframe-1.15.0.zip'
const collectionEditor = 'https://sunbirdpublic.blob.core.windows.net/sunbird-public-dev/artefacts/editor/collection-editor-iframe-1.15.0.zip'
const genericEditor = 'https://sunbirdpublic.blob.core.windows.net/sunbird-public-dev/artefacts/editor/generic-editor-iframe-1.15.0.zip'
const editorsDestPath = 'client/src/thirdparty/editors/'

gulp.task('clean:editors', () => {
    return gulp.src('./' + editorsDestPath, { read: false })
        .pipe(clean())
})
gulp.task('download:content:editor', () => {
    return download(contentEditor)
        .pipe(decompress())
        .pipe(gulp.dest(editorsDestPath + 'content-editor'))
})

gulp.task('download:collection:editor', () => {
    return download(collectionEditor)
        .pipe(decompress())
        .pipe(gulp.dest(editorsDestPath + 'collection-editor'))
})

gulp.task('download:generic:editor', () => {
    return download(genericEditor)
        .pipe(decompress())
        .pipe(gulp.dest(editorsDestPath + 'generic-editor'))
})


gulp.task('gzip:editors', () => {
    return gulp.src(['./client/src/thirdparty/editors/**/*.js', './client/src/thirdparty/editors/**/*.css'])
        .pipe(gzip())
        .pipe(gulp.dest('./client/src/thirdparty/editors'))
})

gulp.task('download:editors', gulpSequence('clean:editors', ['download:content:editor', 'download:collection:editor', 'download:generic:editor'], 'gzip:editors'))

gulp.task('clean:client:install', (done) => {
    return gulp.src('./client/node_modules', { read: false })
        .pipe(clean())
})

gulp.task('client:install', (cb) => {
    exec('npm install  --prefix ./client', { maxBuffer: Infinity }, function (err, stdout, stderr) {
        console.log(stdout)
        console.log(stderr)
        cb(err)
    })
})

// To build angular code and rename index file

gulp.task('client:dist', (cb) => {
    exec('npm run build --prefix ./client ', { maxBuffer: Infinity }, function (err, stdout, stderr) {
        console.log(stdout)
        console.log(stderr)
        cb(err)
    })
})

gulp.task('client:gzip', () => {
    return gulp.src(['./dist/*.js', './dist/*.css'])
        .pipe(gzip())
        .pipe(gulp.dest('./dist'))
})

gulp.task('client:brotli', () => {
    return gulp.src(['./dist/*.js', './dist/*.css'])
        .pipe(brotli.compress())
        .pipe(gulp.dest('./dist'))
})

gulp.task('update:index:file', () => {
    return gulp.src('./dist/index.html')
        .pipe(rename('index.ejs'))
        .pipe(gulp.dest('./dist'))
})
gulp.task('clean:index:file', () => {
    return gulp.src('./dist/index.html', { read: false })
        .pipe(clean())
})

gulp.task('prepare:app:dist', () => {
    return gulp.src(['dist/**/*',
        'libs/**/*',
        'helpers/**/*',
        'proxy/**/*',
        'resourcebundles/**/*',
        'cassandra_migration/**/*',
        'themes/**/*',
        'package.json',
        'framework.config.js',
        'package-lock.json',
        'sunbird-plugins/**/*',
        'routes/**/*',
        'server.js'], { 'base': '.' })
        .pipe(gulp.dest('./app_dist'))
})

gulp.task('clean:app:dist', () => {
    return gulp.src('./app_dist', { read: false })
        .pipe(clean())
})

gulp.task('build-resource-bundles', (cb) => {
    exec('node helpers/resourceBundles/build.js', function (err, stdout, stderr) {
        console.log(stdout)
        console.log(stderr)
        cb(err)
    })
})
const compress = process.env.disableCompression === 'true' ? [] : ['client:gzip', 'client:brotli']
gulp.task('deploy',
    gulpSequence('clean:app:dist',
        'clean:editors',
        ['download:content:editor',
            'download:collection:editor',
            'download:generic:editor'],
        'gzip:editors',
        'build-resource-bundles',
        'clean:client:install',
        'client:install',
        'client:dist',
        compress,  
        'update:index:file',
        'clean:index:file',
        'prepare:app:dist')
)


// offline app preparation tasks

gulp.task('offline-client:dist', (cb) => {
    exec('npm run build-offline-prod --prefix ./client ', { maxBuffer: Infinity }, function (err, stdout, stderr) {
        console.log(stdout)
        console.log(stderr)
        cb(err)
    })
})

gulp.task('install-player', (cb) => {
    exec('npm install  @project-sunbird/content-player --no-save', { maxBuffer: Infinity }, function (err, stdout, stderr) {
        console.log(stdout)
        console.log(stderr)
        cb(err)
    })
})

gulp.task('copy-player', () => {
    return gulp.src(['node_modules/@project-sunbird/content-player/**/*'], { "base": "node_modules/@project-sunbird/content-player" })
        .pipe(gulp.dest('./dist/contentPlayer/'))
})

gulp.task('clean:content-player:modules', (done) => {
    return gulp.src('./node_modules/@project-sunbird/content-player/node_modules', { read: false })
        .pipe(clean())
})

gulp.task('build-offline', gulpSequence(
    'clean:client:install',
    'client:install',
    'offline-client:dist',
    'update:index:file',
    'clean:index:file'
))
