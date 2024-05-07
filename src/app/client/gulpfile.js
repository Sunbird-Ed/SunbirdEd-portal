const gulp = require('gulp')
const rename = require('gulp-rename')
const inject = require('gulp-inject-string')
const download = require('gulp-download-stream')
const decompress = require('gulp-decompress')
const clean = require('gulp-clean')
const gzip = require('gulp-gzip')
const brotli = require('gulp-brotli');

const cdnFallBackScript = `\n<script type="text/javascript" src="${process.env.sunbird_portal_cdn_url}assets/cdnHelper.js"></script>
<script>
    try {
        if(!cdnFileLoaded){
            var now = new Date();
            now.setMinutes(now.getMinutes() + 5);
            document.cookie = "cdnFailed=yes;expires=" + now.toUTCString() + ";"
            window.location.href = window.location.href
        }
    } catch (err) {
        var now = new Date();
        now.setMinutes(now.getMinutes() + 5);
        document.cookie = "cdnFailed=yes;expires=" + now.toUTCString() + ";"
        window.location.href = window.location.href
    }
</script>`
gulp.task('inject:cdnFallBack:script', () => {
    return gulp.src('./../dist-cdn/index.html')
        .pipe(inject.after('</app-root>', cdnFallBackScript))
        .pipe(rename('index_cdn.ejs'))
        .pipe(gulp.dest('./../dist-cdn'))
})

gulp.task('client:gzip', () => {
    return gulp.src(['./../dist/*.js', './../dist/*.css'])
        .pipe(gzip())
        .pipe(gulp.dest('./../dist'))
})

gulp.task('client:brotli', () => {
    return gulp.src(['./../dist/*.js', './../dist/*.css'])
        .pipe(brotli.compress())
        .pipe(gulp.dest('./../dist'))
})

gulp.task('update:index:file', () => {
    return gulp.src('./../dist/index.html')
        .pipe(rename('index.ejs'))
        .pipe(gulp.dest('./../dist'))
})
gulp.task('clean:index:file', () => {
    return gulp.src('./../dist/index.html', { read: false, allowEmpty: true })
        .pipe(clean())
})

const compress = process.env.devBuild === 'true' ? '' : ['client:gzip'] // removed brotli due to gulp issue

gulp.task('post:build', gulp.series(
    compress
    ));