const _ = require('lodash');
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const {utils} = require('./utilityService');
const logger = require('sb_logger_util_v2');

// Copy client url.config.json here
// This is used to generate whitelist URLs
const CLIENT_URLS = {
   
  }

const WHITELIST_URLS = [    
    //System related APIs
    'data/v1/system/settings/get/contentComingSoonMsg',
    'data/v1/system/settings/get/custodianOrgId',
    'data/v1/system/settings/get/courseFrameworkId',
    'data/v1/system/settings/get/tncConfig',
    'data/v1/system/settings/get/ssoCourseSection',
    'data/v1/system/settings/get',
    
    //Course related APIs
    'course/v1/hierarchy',
    'course/v1/search',
    'course/v1/content/state/read',
    'course/v1/content/state/update',
    'course/v1/user/enrollment/list',
    'course/v1/enrol',
    'course/v1/unenrol',
    'course/v1/qrcode/download',
    'recommended/courses',
    'badging/v1/issuer/badge/search',
    'badging/v1/issuer/badge/assertion/create',

    //Batch related APIs
    'course/v1/batch/create',
    'course/v1/batch/update',
    'course/v1/batch/user/add',
    'course/v1/batch/read',
    'course/v1/batch/participants/list',
    'course/v1/batch/list',
    'course/v1/batch/user/remove',  

    //User related APIs
    'user/v1/create',
    'user/v1/tnc/accept',
    'user/v1/update',
    'user/v1/skill/endorse/add',
    'user/v1/skill/update',
    'user/v1/skill/read',
    'user/v1/profile/visibility',
    'user/v1/get',
    'user/v1/exists',
    'user/v1/signup',
    'user/v1/certs/download',
    'user/v1/feed',
    'user/v1/migrate',
    'user/v1/type/list',
    'user/v1/block',
    'user/v1/search',
    'user/v1/role/assign',
    'user/v1/read/', 
    'user/v1/upload',
    'user/v2/read/',  
    'user/v2/create',
    'user/v2/accept/tnc',
    'user/v2/bulk/upload',
    'user/v2/upload',
    'get/tenant/logo',
    '/v1/tenant',
    '/info',
    'data/v1/skills',
    'data/v1/location/search', 
    'data/v1/role/read',
    'certreg/v1/certs/validate',
    'otp/v1/verify',
    'otp/v1/generate',
    'certreg/v1/certs/download',

    //Admin related APIs
    'data/v1/upload/status',
    
    // ORD related APIs
    'org/v1/search',
    'org/v1/upload',
    'org/v1/type/list',
    'org/v1/type/create',
    'org/v1/type/update',
    'org/v1/role/assign',

    //Dashboard related APIs
    'dashboard/v1/creation/org',
    'dashboard/v1/consumption/org',
    'dashboard/v1/progress/course',
    'dashboard/v1/consumption/course',
    'dashboard/v2/progress/course',

    // Notes related APIs
    'notes/v1/create',
    'notes/v1/delete',
    'notes/v1/read',
    'notes/v1/search',
    'notes/v1/update',

    //Other APIs
    'framework/v1/read',        // Framework details
    'data/v1/page/assemble',    // Page assemble
    'data/v1/role/read',        // Role read
    'content/v1/media/upload',
    'role/read'
];

const allowedUrls = function() {
    var flatObj = utils.flattenObject(CLIENT_URLS);
    console.log('==========');
    console.log(flatObj);
};

const isWhitelistUrl = function() {
    return function (req, res, next) {
        var reqUrl = req.originalUrl.replace('/learner/', '');
        // var reqUrl = req.originalUrl;
        var validUrl = false;
        isExist(reqUrl, function(result) {
            validUrl = result;
        });
        if(validUrl) {
            console.log(':) valid URL' + req.originalUrl);
            next();
        }
        else {
            logger.error({msg: 'XXXX Invalid URL request', url: req.originalUrl});
            res.status(401)
            res.send({
              'id': 'api.error',
              'ver': '1.0',
              'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
              'params': {
                'resmsgid': uuidv1(),
                'msgid': null,
                'status': 'failed',
                'err': 'UNAUTHORIZED_ERROR',
                'errmsg': 'Unauthorized: Access is denied'
              },
              'responseCode': 'UNAUTHORIZED',
              'result': {}
            })
            res.end()
        }
    }
};


/**
 * [getRedirectUrl : this function is used for get the local(private) api.]
 * @param  {[string]}   requestUrl [api call by portal or public api]
 * @param  {[object]}   urlMap     [api map. Where all api are maped]
 * @param  {Function}   cb         [Cb have public and private api]
 * @return {[Function]}            [description]
 */
var isExist = function (requestUrl, cb) {
    
    // Number of iteraions to find actutal url path exist in whitelist urls
    // ex:  'dashboard/v1/creation/org/{orgid}?{url-prams}
    let isValid = false;

    _.forEach(WHITELIST_URLS, function(val){
        if(_.startsWith(requestUrl, val)) {
            if(_.includes(requestUrl, val)) {
                isValid = true;
                return;
            }
        }
    });
    // let iterations = [1, 2, 3];
    // _.forEach(iterations, function(val){
    //     let urlIndex = _.indexOf(WHITELIST_URLS, requestUrl);
    //     if (urlIndex > -1) {
    //         isValid = true;(true);
    //         return;
    //     } else {
    //         // Remoing the last item from the URL
    //         uriArray = requestUrl.split('/')
    //         uriArray.pop()
    //         requestUrl = uriArray.join('/')
    //     }
    // });
    
    // Not exist in whitelist URLs
    cb(isValid);

    // let urlIndex = _.indexOf(WHITELIST_URLS[requestUrl]);
    // if (urlIndex > -1) {
    //     return true
    // } else {
    //   uriArray = requestUrl.split('/')
    //   uriArray.pop()
    //   requestUrl = uriArray.join('/')
    //   urlIndex = _.indexOf(WHITELIST_URLS[requestUrl]);
    //   if (urlIndex > -1) {
    //       return true;
    //   } else {
    //     uriArray = requestUrl.split('/')
    //     uriArray.pop()
    //     requestUrl = uriArray.join('/')
    //     urlIndex = _.indexOf(WHITELIST_URLS[requestUrl]);
    //     if (urlIndex > -1) {
    //         return true
    //     } else {
    //        return false;
    //     }
    //   }
    // }
}

module.exports = { allowedUrls, isWhitelistUrl }