const proxyHeaders = require('../proxy/proxyUtils.js')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const contentProxyUrl = envHelper.CONTENT_PROXY_URL
const contentServiceBaseUrl = envHelper.CONTENT_URL
const { logger } = require('@project-sunbird/logger');
const proxyUtils = require('../proxy/proxyUtils.js')
const mockData = require("./mockdata/asset.json")


module.exports = function (app) {
    const proxyReqPathResolverMethod = function (req) {
        return require('url').parse(contentProxyUrl + req.originalUrl).path
    }

    app.all('/api/content/v1/search', proxyObj());

    app.all('/api/content/v1/create', proxyObj());

    app.all('/api/content/v1/upload/:id', proxyObj());

    app.all('/api/content/v1/read/:id', proxyObj());

    app.all('/api/asset/v1/upload/:id', proxyObj());

    app.use('/api/*', proxy(contentProxyUrl, {
        proxyReqPathResolver: proxyReqPathResolverMethod
    }))


}


function proxyObj() {
    return proxy(contentProxyUrl, {
        proxyReqOptDecorator: proxyUtils.decoratePublicRequestHeaders(),
        proxyReqPathResolver: function (req) {
            let urlParam = req.originalUrl;
            let query = require('url').parse(req.url).query;
            if (query) {
                return require('url').parse(contentProxyUrl + urlParam + '?' + query).path
            } else {
                return require('url').parse(contentProxyUrl + urlParam).path
            }
        },
        userResDecorator: (proxyRes, proxyResData, req, res) => {
            try {
                logger.info({ msg: 'proxyObj' + req.method + ' - ' + req.url });
                const data = JSON.parse(proxyResData.toString('utf8'));
                if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
            } catch (err) {
                logger.error({ msg: 'Error occurred while featching the data' });
                return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
            }
        }
    })
}

