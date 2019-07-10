const gulp = require('gulp')
const rename = require('gulp-rename')
const inject = require('gulp-inject-string')
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
    return gulp.src('./../dist/index.html')
        .pipe(inject.after('</app-root>', cdnFallBackScript))
        .pipe(rename('index_cdn.ejs'))
        .pipe(gulp.dest('./../dist'))
})
