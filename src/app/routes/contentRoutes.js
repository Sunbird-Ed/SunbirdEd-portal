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
const { logger } = require('@project-sunbird/logger');
const bodyParser = require('body-parser')
const isAPIWhitelisted = require('../helpers/apiWhiteList');
const courseSearchURI = '/content/course/v1/search';
const assetUploadURI = '/content/asset/v1/upload/:id';
const contentAllURI = '/content/*';
const copyQuestionSetURI = '/content/questionset/v1/copy/:id';

module.exports = (app) => {
    app.all(courseSearchURI,
        proxyManagedUserRequest(courseSearchURI)
    );
    app.all(assetUploadURI,
        proxyUtils.verifyToken(),
        isAPIWhitelisted.isAllowed(),
        proxyManagedUserRequest(assetUploadURI)
    );
    app.all(contentAllURI,
        // Generate telemetry for content service
        telemetryHelper.generateTelemetryForContentService,
        // Generate telemetry for proxy service
        telemetryHelper.generateTelemetryForProxy,
        bodyParser.json({ limit: '10mb' }),
        bodyParser.urlencoded({ extended: true }),
        // check the lock router  and assign admin as collaborator of textbook
        orgAdminHelper.orgAdminAsCollaborator,
        healthService.checkDependantServiceHealth(['CONTENT', 'CASSANDRA']),
        proxyUtils.verifyToken(),
        isAPIWhitelisted.isAllowed(),
        proxyManagedUserRequest(contentAllURI)
    );
    /**
    * function indicating that it handles HTTP POST requests. 
    * @description The route path is /content/questionset/v1/copy/:id, where :id is a route parameter that can be accessed within the route handler.
    * @function proxyUtils.verifyToken(),isAPIWhitelisted.isAllowed() : it is used to handle the authentication and authorization.
    */
    app.post(copyQuestionSetURI,
        proxyUtils.verifyToken(),
        isAPIWhitelisted.isAllowed(),
        proxyManagedUserRequest(copyQuestionSetURI)
    );
}
/**
* @description function will return the original URl based on api route path 
* @param {apiRoutePath} string api route url
* @function proxy() : it is used as the route handler. It acts as a reverse proxy, forwarding the request to another URL specified by contentURl.
* @field reqDataLimitOfContentUpload - it will sets a limit on the request body size for content uploading.
* @function proxyReqOptDecorator - it decorates the request headers before they are sent to the target URL specified by contentURL.
* @function proxyReqPathResolver - it resolves the proxy request path. It modifies the original URL path by removing the /content/ segment and appends it to contentURL. 
* @function userResDecorator - it decorates the response from the target URL before it is sent back to the client. It performs additional processing on the response data. 
* @function proxyUtils.handleSessionExpiry() -  it is called to handle session expiry. 
*/
function proxyManagedUserRequest(apiRoutePath) {
    return proxy(contentURL, {
        limit: reqDataLimitOfContentUpload,
        proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentURL),
        proxyReqPathResolver: (req) => {
            if (apiRoutePath === contentAllURI) {
                let urlParam = req.params['0']
                let query = require('url').parse(req.url).query
                if (query) {
                    return require('url').parse(contentURL + urlParam + '?' + query).path
                } else {
                    return require('url').parse(contentURL + urlParam).path
                }
            }
            else {
                logger.info({ msg: apiRoutePath + 'called - ' + req.method + ' - ' + req.url });
                return require('url').parse(contentURL + req.originalUrl.replace('/content/', '')).path
            }
        },
        userResDecorator: (proxyRes, proxyResData, req, res) => {
            try {
                logger.info({ msg: apiRoutePath + 'called - ' + req.method + ' - ' + req.url });
                const data = JSON.parse(proxyResData.toString('utf8'));
                if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data)
            } catch (err) {
                logger.error({ msg: 'content api user res decorator json parse error', proxyResData });
                return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res)
            }
        }
    });
}