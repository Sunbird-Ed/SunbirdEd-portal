var fs = require('fs');
var gulp = require('gulp');
var rev = require('gulp-rev')
var collect = require('gulp-rev-collector')
var revdel = require('gulp-rev-del-redundant');
var runSequence = require('run-sequence');
var argv = require('yargs').argv;
var urlPrefixer = require('gulp-url-prefixer');
var async = require("async");
var rmdir = require('rmdir');
var deployAzureCdn = require('gulp-deploy-azure-cdn');
var rename = require('gulp-rename');
var htmlstringreplace = require('gulp-string-replace');

//credentials for cdn provider
var cdnServiceCredentials = {
  accountName: argv.accountName,
  accessKey: argv.accessKey,
  cdnServiceProvider: argv.provider || 'azure'
}

var containerName = argv.containerName || 'tenants';
var cdnurl = argv.cdnurl + '/' + containerName;
var particularTenants = argv.tenant || '';

//name if the output folder from which cdn file push done
var distFolderName = 'tenants-build';

var tenantName,sourceTenantFolderPath,distBaseUrl,cdnTargetFolder;
var paths = {}

//folder from which files are read and build is prepared
var sourceFolderPath = argv.tenantpath || 'tenant'

// if(!argv.accountName || !argv.accessKey){
//   console.log("<-------- Error --------> Please Provide CDN Provider Credentials <-------- Error -------->")
//   return;
// }

if(!argv.cdnurl){
  console.log("<-------- Error --------> CDN URL Missing <-------- Error -------->")
  return;
}

//set all static paths before starting build
function recomputeStaticVariables (foldername) {
  tenantName = foldername;
  sourceTenantFolderPath = sourceFolderPath + '/' + tenantName;
  distBaseUrl = distFolderName + '/' + tenantName
  cdnTargetFolder = cdnurl +  '/' + tenantName;

  paths = {
    src: sourceTenantFolderPath + '/**/*',
    dist: distBaseUrl,
    distHTML: sourceTenantFolderPath + '/**/*.html',
    distHtml: distBaseUrl + '/**/*.html',
    distCSS: distBaseUrl + '/**/*.css',
    // distAssets : distBaseUrl + '/**/*.{jpg,png,jpeg,gif,svg,eot,ttf,woff,woff2}'
  };
}

gulp.task('clean', function () {
  return rmdir(paths.dist)
});

//copy the source tenant folder to dest folder
gulp.task('copyFolder',function(){
  return gulp.src(paths.src).pipe(gulp.dest(paths.dist));
})

//reference html files changes
gulp.task('prefixCdnUrlForHtmlFiles', function () {
  return gulp.src(paths.distHTML)
    .pipe(urlPrefixer.html({
      prefix: cdnTargetFolder,
      tags: ['script', 'link', 'img']
    }))
    .pipe(gulp.dest(paths.dist));
});

// //css reference changes in html and styles
gulp.task('prefixCdnUrlForCssFiles', function() {
  return gulp.src([paths.distCSS,paths.distHtml])
  .pipe(urlPrefixer.css({
    prefix: cdnTargetFolder
  }))
  .pipe(gulp.dest(paths.dist));
});

// file names renaming
gulp.task('fileVersioning', () =>{
  return gulp.src([paths.dist+'/**/*'])
  .pipe(rev())
  .pipe(gulp.dest(paths.dist))
  .pipe(rev.manifest('rev-manifest.json'))
  .pipe(revdel('rev-manifest.json',{dest: paths.dist,merge: true}))
  .pipe(gulp.dest(paths.dist)) 
});

//reference changes in all files
gulp.task('updateAssetsReferences', () =>{
  return gulp.src([distBaseUrl + '/rev-manifest.json',paths.dist + '/**/*.{html,json,css,js}'])
     .pipe(collect())
     .pipe(gulp.dest(paths.dist))
});

//renaming index.html hashed file to index.html 
gulp.task('renameIndexFile', function() {
    var manifest = JSON.parse(fs.readFileSync(distBaseUrl + '/rev-manifest.json'))
    // 'dist/*.html'
    return gulp.src( paths.dist + '/' + manifest['index.html'] )
        .pipe(rename('index.html'))
        .pipe(gulp.dest(paths.dist))
});

// delete hashed index.html file
gulp.task('deletIndexFile', function() {
  var manifest = JSON.parse(fs.readFileSync(distBaseUrl + '/rev-manifest.json'))
  return fs.unlink(distFolderName + '/' + tenantName + '/' + manifest['index.html'],function(){
  })
});

//remove rev-manifest.json after every tenant build which is loacated in respective tenant dist folder
gulp.task('deleteManifest', function() {
  return fs.unlink(paths.dist + '/rev-manifest.json',function(){
  })
});

//remove file name versoning string in index.html file
gulp.task('replaceindexPageText', function() {
  var manifest = JSON.parse(fs.readFileSync(distBaseUrl + '/rev-manifest.json'))
  return gulp.src([paths.distHtml])
    .pipe(htmlstringreplace(manifest['index.html'], 'index.html'))
    .pipe(gulp.dest(paths.dist))
});

//upload to cdn store
gulp.task('uploadAppToCdn', function () {
  if(cdnServiceCredentials.cdnServiceProvider == 'azure'){
    if(!cdnServiceCredentials.accountName || !cdnServiceCredentials.accessKey){
      return;
    }
    return gulp.src([distFolderName + '/' + tenantName + '/**/*'], {
    }).pipe(deployAzureCdn({
        containerName: containerName, // container name in blob
        serviceOptions: [cdnServiceCredentials.accountName,cdnServiceCredentials.accessKey], // custom arguments to azure.createBlobService
        folder: tenantName, // path within container
        zip: true, // gzip files if they become smaller after zipping, content-encoding header will change if file is zipped
        deleteExistingBlobs: true, // true means recursively deleting anything under folder
        concurrentUploadThreads: 10, // number of concurrent uploads, choose best for your network condition
        testRun: false // test run - means no blobs will be actually deleted or uploaded, see log messages for details
    })).on('error', function(err){
      console.log("<-------- Error --------> err while uploading files to cdn service ",err)
    });
  }else{
    console.log("<-------- Error --------> CDN Service Provider Provided in args Not Supported <-------- Error -------->")
  }
});


//first step of the build function which loops tenant folder (source) and creates build in series
gulp.task('pushTenantsToCDN', () =>{

  if(!fs.existsSync(sourceFolderPath)){
    console.warn("<-----------Warning----------->","specified tenant folder not found")
    return;
  }

  fs.readdir(sourceFolderPath, (err, files) => {

    //check for arguments and run only for those tenants mentioned in the arguments
    if(particularTenants && particularTenants.length){
      files = particularTenants.split(',');
    }

    if(files && files.length){
      async.eachSeries(files, function (foldername, next) {
        if(fs.existsSync(sourceFolderPath + '/' + foldername) && fs.lstatSync(sourceFolderPath + '/' + foldername).isDirectory()){
          recomputeStaticVariables(foldername)
          runSequence('clean','copyFolder','prefixCdnUrlForHtmlFiles','prefixCdnUrlForCssFiles','fileVersioning','updateAssetsReferences','renameIndexFile','replaceindexPageText','deletIndexFile','deleteManifest','uploadAppToCdn', function(){
            next()
          }) 
        }else{
          console.warn("<-----------Warning----------->",foldername + " folder not found")
          next()
        }
      },function(){
        console.warn('Success! - All files processing done and pushed to CDN Provider');
        
        if(cdnServiceCredentials.accountName && cdnServiceCredentials.accessKey){
          // delete dist folder once build && pushing to cdn is completed.
          rmdir(distFolderName,function(err,done){
          });
        }
        return;
      });
    }else{
      console.warn("<-----------Warning----------->","no tenants found in specified folder " + sourceFolderPath)
    }

  })

})


