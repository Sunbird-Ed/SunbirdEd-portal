const proxyHeaders = require('../proxy/proxyUtils.js')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const permissionsHelper = require('../helpers/permissionsHelper.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const contentProxyUrl = envHelper.CONTENT_PROXY_URL
const contentServiceBaseUrl = envHelper.CONTENT_URL

module.exports = function (app) {
    const proxyReqPathResolverMethod = function (req) {
        return require('url').parse(contentProxyUrl + req.originalUrl).path
    }

    app.use('/api/*', permissionsHelper.checkPermission(), proxy(contentProxyUrl, {
        proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
        proxyReqPathResolver: proxyReqPathResolverMethod,
        userResDecorator: (proxyRes, proxyResData, req, res) => {
            proxyData = JSON.parse(proxyResData.toString('utf8'));
            if(req.method === 'GET' && proxyData.message === 'API not found with these values') res.redirect('/')
            return proxyResData;
        }
    }))
}