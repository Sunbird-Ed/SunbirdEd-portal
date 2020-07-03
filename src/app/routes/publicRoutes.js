const proxyHeaders = require('../proxy/proxyUtils.js')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const permissionsHelper = require('../helpers/permissionsHelper.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const contentProxyUrl = envHelper.CONTENT_PROXY_URL
const contentServiceBaseUrl = envHelper.CONTENT_URL
const logger = require('sb_logger_util_v2')
const { logDebug, logErr, logInfo } = require('./../helpers/utilityService');

module.exports = function (app) {
    const proxyReqPathResolverMethod = function (req) {
        logDebug(req, {}, `publicroutes called for ${require('url').parse(contentProxyUrl + req.originalUrl).path}`);
        return require('url').parse(contentProxyUrl + req.originalUrl).path
    }

    app.use('/api/*', proxy(contentProxyUrl, {
        proxyReqPathResolver: proxyReqPathResolverMethod
    }))
}

