const proxyHeaders = require('./proxyUtils.js'),
  	proxy = require('express-http-proxy'),
    permissionsHelper = require('./../helpers/permissionsHelper.js'),
    envHelper = require('./../helpers/environmentVariablesHelper.js'),
    contentProxyUrl = envHelper.CONTENT_PROXY_URL,
    reqDataLimitOfContentUpload = '30mb';

module.exports = function(app) {

    const proxyReqPathResolverMethod = function(req) {
        return require('url').parse(contentProxyUrl + req.originalUrl).path;
    };

    app.use('/api/*', permissionsHelper.checkPermission(), proxy(contentProxyUrl, {
        preserveHostHdr: true,
        proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
        proxyReqPathResolver: proxyReqPathResolverMethod
    }));

    app.use('/content-plugins/*', proxy(contentProxyUrl, {
        preserveHostHdr: true,
        proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
        proxyReqPathResolver: proxyReqPathResolverMethod
    }));

    app.use('/plugins/*', proxy(contentProxyUrl, {
        preserveHostHdr: true,
        proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
        proxyReqPathResolver: proxyReqPathResolverMethod
    }));

    app.use('/assets/public/*', proxy(contentProxyUrl, {
        preserveHostHdr: true,
        proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
        proxyReqPathResolver: proxyReqPathResolverMethod
    }));

    app.use('/content/preview/*', proxy(contentProxyUrl, {
        preserveHostHdr: true,
        proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
        proxyReqPathResolver: proxyReqPathResolverMethod
    }));

    app.use('/action/*', permissionsHelper.checkPermission(), proxy(contentProxyUrl, {
        preserveHostHdr: true,
        limit: reqDataLimitOfContentUpload,
        proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
        proxyReqPathResolver: proxyReqPathResolverMethod
    }));
};