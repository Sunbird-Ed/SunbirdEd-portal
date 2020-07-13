const http = require('http');
const https = require('https');
const httpAgent = new http.Agent({ keepAlive: true, });
const httpsAgent = new https.Agent({ keepAlive: true, });
const logger = require('sb_logger_util_v2');
const httpProxy = require('http-proxy');
const _ = require('lodash');
const envHelper = require('../helpers/environmentVariablesHelper.js')
const sunbirdApiAuthToken = envHelper.PORTAL_API_AUTH_TOKEN
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')

const defaultProxyErrorHandler = function (error, req, res, target) {
    res.status(500);
    res.send({
        'id': 'api.portal.error',
        'ver': '1.0',
        'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        'params': {
          'resmsgid': uuidv1(),
          'msgid': null,
          'status': 'failed',
          'err': _.get(error, 'code') || 'UNHANDLED_EXCEPTION',
          'errmsg': _.get(error, 'reason') || 'Access denied'
        },
        'responseCode': 'UNHANDLED_EXCEPTION',
        'result': {}
    });
}

const defaultProxyRequestInterceptor = function (proxyReq, req, res, options) {
    if (_.get(req, 'kauth.grant.access_token.token')) {
        proxyReq.setHeader('x-authenticated-user-token', _.get(req, 'kauth.grant.access_token.token'));
    }
    proxyReq.setHeader('accept-encoding', req.headers['accept-encoding']);
}

const defaultProxyResponseInterceptor = function (proxyRes, req, res) {
    if (proxyRes.statusCode <= 399) {
        res.set(proxyRes.headers); // set headers
        return proxyRes.pipe(res);
    }
    let chunks = [];
    proxyRes.on("data", (chunk) => chunks.push(chunk));
    proxyRes.on("end", function () {
        let body = Buffer.concat(chunks);
        res.status(proxyRes.statusCode);
        logger.error({ mes: 'got error from upstream server', error: body.toString()});
        res.end(body.toString());
    });
}

const defaultPathResolver = req => req.originalUrl

module.exports = function ({
    target,
    proxyPathResolver = defaultPathResolver,
    proxyErrorHandler = defaultProxyErrorHandler,
    proxyRequestInterceptor = defaultProxyRequestInterceptor,
    proxyResponseInterceptor = defaultProxyResponseInterceptor
}) {
    const proxyServerOption = {
        secure: false, // to enable http -> https, for secure connection we need to add ssl certs to server options
        target: target, // set target
        agent: target.startsWith('https') ? httpsAgent : httpAgent, // add custom agent with keep alive
        headers: { 'Authorization': 'Bearer ' + sunbirdApiAuthToken }, // add additional headers
        selfHandleResponse: true, // enables override response from proxy server
    }
    const proxyServer = httpProxy.createProxyServer(proxyServerOption);
    proxyServer.on('error', proxyErrorHandler);
    proxyServer.on('proxyReq', proxyRequestInterceptor);
    proxyServer.on('proxyRes', proxyResponseInterceptor);
    return (req, res) => {
        req.url = proxyPathResolver(req);
        proxyServer.web(req, res);
    }
} 