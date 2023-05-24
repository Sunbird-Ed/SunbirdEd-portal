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

    app.all('/content/asset/v1/upload/:id',
    proxyUtils.verifyToken(),
    isAPIWhitelisted.isAllowed(),
    proxy(contentURL, {
        limit: reqDataLimitOfContentUpload,
        proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentURL),
        proxyReqPathResolver: (req) => {
            logger.info({
                msg: '/content/asset/v1/upload/:id called'
            });
            return require('url').parse(contentURL + req.originalUrl.replace('/content/', '')).path
        }
    })
)

    app.all('/content/*',
            // Generate telemetry for content service
            telemetryHelper.generateTelemetryForContentService,
            // Generate telemetry for proxy service
            telemetryHelper.generateTelemetryForProxy,
            bodyParser.json({limit: '10mb'}),
            bodyParser.urlencoded({ extended: true }),
            // check the lock router  and assign admin as collaborator of textbook
            orgAdminHelper.orgAdminAsCollaborator,
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
                        return require('url').parse(contentURL + urlParam + '?' + query).path
                    } else {
                        return require('url').parse(contentURL + urlParam).path
                    }
                },
                userResDecorator: (proxyRes, proxyResData, req, res) => {
                    try {
                        logger.info({ msg: '/content/* called - ' + req.method + ' - ' + req.url });
                        const data = JSON.parse(proxyResData.toString('utf8'));
                        if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                        else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data)
                    } catch (err) {
                        logger.error({ msg: 'content api user res decorator json parse error', proxyResData });
                        return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res)
                    }
                }
            })
        )
        app.all('/content/questionset/v1/copy/:id',
        proxyUtils.verifyToken(),
        isAPIWhitelisted.isAllowed(),
        proxy(contentURL, {
            limit: reqDataLimitOfContentUpload,
            proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentURL),
            proxyReqPathResolver: (req) => {
                console.log('I am here and trying to fix this issue')
                console.log(
                    '/content/questionset/v1/copy/:id called'
                );
                return require('url').parse(contentURL + req.originalUrl.replace('/content/', '')).path
            },
            userResDecorator: (proxyRes, proxyResData, req, res) => {
                try {
                    logger.info({ msg: '/content/questionset/v1/copy/:id called - ' + req.method + ' - ' + req.url });
                    const data = JSON.parse(proxyResData.toString('utf8'));
                    if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                    else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data)
                } catch (err) {
                    logger.error({ msg: 'content api user res decorator json parse error', proxyResData });
                    return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res)
                }
            }
        })
    )
}
