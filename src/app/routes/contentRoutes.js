const proxyUtils = require('../proxy/proxyUtils.js')
const permissionsHelper = require('../helpers/permissionsHelper.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const contentURL = envHelper.CONTENT_URL
const telemetryHelper = require('../helpers/telemetryHelper.js')
const reqDataLimitOfContentUpload = '50mb'
const proxy = require('express-http-proxy')

module.exports = function (app) {
    // Generate telemetry fot proxy service
    app.all('/content/*', telemetryHelper.generateTelemetryForContentService,
        telemetryHelper.generateTelemetryForProxy)

    app.all('/content/*',
        proxyUtils.verifyToken(),
        permissionsHelper.checkPermission(),
        proxy(contentURL, {
            limit: reqDataLimitOfContentUpload,
            proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
            proxyReqPathResolver: function (req) {
                let urlParam = req.params['0']
                let query = require('url').parse(req.url).query
                if (query) {
                    return require('url').parse(contentURL + urlParam + '?' + query).path
                } else {
                    return require('url').parse(contentURL + urlParam).path
                }
            }
        }))
}