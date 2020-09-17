/**
 * @file
 * @description - Content routes handler
 * @version 1.0
 */
const proxyUtils = require('../proxy/proxyUtils.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const contentURL = envHelper.CONTENT_URL
const telemetryHelper = require('../helpers/telemetryHelper.js')
const orgAdminHelper = require('../helpers/orgAdminHelper.js')
const reqDataLimitOfContentUpload = '50mb'
const proxy = require('express-http-proxy')
const healthService = require('../helpers/healthCheckService.js')
const _ = require('lodash')
const logger = require('sb_logger_util_v2')
const bodyParser = require('body-parser')
const isAPIWhitelisted = require('../helpers/apiWhiteList');
const { nextTick } = require('process')
module.exports = (app) => {
    app.all('/content/course/v1/search',
        proxy(contentURL, {
            limit: reqDataLimitOfContentUpload,
            proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentURL),
            proxyReqPathResolver: (req) => {
                logger.info({
                    msg: '/content/course/v1/search called'
                });
                return require('url').parse(contentURL + req.originalUrl.replace('/content/', '')).path
            }
        })
    )
    // app.all('/content/makeAdmin', 
    // bodyParser.urlencoded({ extended: false }), 
    // bodyParser.json(),
    // async (req, res) => {
    //  orgAdminHelper.assignOrgAdminAsCollaborator(req.body.request.resourceId, req).then(res => {
    //      console.log("here we are");
    //      if(res.status == 200){
    //          console.log("success")
    //      }
    //      else {
    //          console.log("Unsuccess")
    //      }
    //  })}
    // ) 
// app.all('/content/lock/v1/create',
//     // Generate telemetry for content service
//     telemetryHelper.generateTelemetryForContentService,
//     // Generate telemetry for proxy service
//     telemetryHelper.generateTelemetryForProxy,
//     bodyParser.json(),
//     async (req, res) => {
//         orgAdminHelper.assignOrgAdminAsCollaborator(req.body.request.resourceId, req).then(res => {
//             console.log("here we are");
//             if(res.status == 200){
//                 console.log("success")
//             }
//             else {
//                 console.log("Unsuccess")
//             }
//         })},
    
//     healthService.checkDependantServiceHealth(['CONTENT', 'CASSANDRA']),
//     proxyUtils.verifyToken(),
//     isAPIWhitelisted.isAllowed(),
//     proxy(contentURL, {
//         limit: reqDataLimitOfContentUpload,
//         proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentURL),
//         proxyReqPathResolver: (req) => {
//             let urlParam = req.params['0']
//             let query = require('url').parse(req.url).query
//             if (query) {
//                 logger.info({
//                     msg: req.url + 'called - '
//                 });
//                 return require('url').parse(contentURL + urlParam + '?' + query).path
//             } else {
//                 logger.info({
//                     msg: req.url + 'called - '
//                 });
//                 return require('url').parse(contentURL + urlParam).path
//             }
//         },
//         userResDecorator: (proxyRes, proxyResData, req, res) => {
//             try {
//                 logger.info({
//                     msg: '/content---------------------/* called - ' + req.method + ' - ' + req.url
//                 });
//                 const data = JSON.parse(proxyResData.toString('utf8'));
//                 if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
//                 else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data)
//             } catch (err) {
//                 logger.error({
//                     msg: 'content api user res decorator json parse error',
//                     proxyResData
//                 });
//                 return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res)
//             }
//         },
//     })
// )


    app.all('/content/*',

        bodyParser.json(),
         (req, res, next) => {
            if(req.url == '/content/lock/v1/create') { 
            orgAdminHelper.assignOrgAdminAsCollaborator(req.body.request.resourceId, req).then(res => {
            if(res.status == 200){
                console.log("success")
            }
            else {
                console.log("Unsuccess")
            }
        })}
        next()
    },
        // Generate telemetry for content service
        telemetryHelper.generateTelemetryForContentService,
        // Generate telemetry for proxy service
        telemetryHelper.generateTelemetryForProxy,
        bodyParser.json(),
        healthService.checkDependantServiceHealth(['CONTENT', 'CASSANDRA']),
        proxyUtils.verifyToken(),
        isAPIWhitelisted.isAllowed(),
        proxy(contentURL, {
            limit: reqDataLimitOfContentUpload,
            proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentURL),
            proxyReqPathResolver: (req) => {
                let urlParam = req.params['0']
                let query = require('url').parse(req.url).query
                if (query) {
                    logger.info({
                        msg: req.url + 'called - '
                    });
                    return require('url').parse(contentURL + urlParam + '?' + query).path
                } else {
                    logger.info({
                        msg: req.url + 'called - '
                    });
                    return require('url').parse(contentURL + urlParam).path
                }
            },
            userResDecorator: (proxyRes, proxyResData, req, res) => {
                try {
                    logger.info({
                        msg: '/content/* called - ' + req.method + ' - ' + req.url
                    });
                    const data = JSON.parse(proxyResData.toString('utf8'));
                    if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                    else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data)
                } catch (err) {
                    logger.error({
                        msg: 'content api user res decorator json parse error',
                        proxyResData
                    });
                    return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res)
                }
            },
        })
    )
}
