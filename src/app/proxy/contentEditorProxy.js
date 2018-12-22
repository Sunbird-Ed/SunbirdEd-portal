const proxyHeaders = require('./proxyUtils.js')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const permissionsHelper = require('./../helpers/permissionsHelper.js')
const envHelper = require('./../helpers/environmentVariablesHelper.js')
const contentProxyUrl = envHelper.CONTENT_PROXY_URL
const learnerServiceBaseUrl = envHelper.LEARNER_URL
const learner_Service_Local_BaseUrl = envHelper.learner_Service_Local_BaseUrl
const contentServiceBaseUrl = envHelper.CONTENT_URL
const reqDataLimitOfContentUpload = '30mb'
const telemetryHelper = require('../helpers/telemetryHelper')
const learnerURL = envHelper.LEARNER_URL

module.exports = function (app) {

  const proxyReqPathResolverMethod = function (req) {
    return require('url').parse(contentProxyUrl + req.originalUrl).path
  }
  app.use('/plugins/v1/search', proxy(contentServiceBaseUrl, {
    preserveHostHdr: true,
    proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
    proxyReqPathResolver: function (req) {
      var originalUrl = req.originalUrl
      originalUrl = originalUrl.replace('/', '')
      return require('url').parse(contentServiceBaseUrl + originalUrl).path
    }
  }))

  app.use('/content-plugins/*', proxy(contentProxyUrl, {
    preserveHostHdr: true,
    proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
    proxyReqPathResolver: proxyReqPathResolverMethod
  }))

  app.use('/plugins/*', proxy(contentProxyUrl, {
    preserveHostHdr: true,
    proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
    proxyReqPathResolver: proxyReqPathResolverMethod
  }))

  app.use('/assets/public/*', proxy(contentProxyUrl, {
    preserveHostHdr: true,
    proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
    proxyReqPathResolver: proxyReqPathResolverMethod
  }))

  app.use('/content/preview/*', proxy(contentProxyUrl, {
    preserveHostHdr: true,
    proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
    proxyReqPathResolver: proxyReqPathResolverMethod
  }))

  // Log telemetry for action api's
  app.all('/action/*', telemetryHelper.generateTelemetryForProxy)

  app.use('/action/content/v3/unlisted/publish/:contentId', permissionsHelper.checkPermission(),
    bodyParser.json(), proxy(contentProxyUrl, {
      preserveHostHdr: true,
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
      proxyReqPathResolver: proxyReqPathResolverMethod,
      proxyReqBodyDecorator: function (bodyContent, srcReq) {
        if (bodyContent && bodyContent.request && bodyContent.request.content) {
          bodyContent.request.content.baseUrl = srcReq.protocol + '://' + srcReq.headers.host
        }
        return bodyContent
      }
    }))

  app.use('/action/data/v1/page/assemble', proxy(learnerServiceBaseUrl, {
    proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
    proxyReqPathResolver: function (req) {
      var originalUrl = req.originalUrl
      originalUrl = originalUrl.replace('/action/', '')
      return require('url').parse(learnerServiceBaseUrl + originalUrl).path
    }
  }))


  app.use('/action/data/v1/form/read', proxy(contentServiceBaseUrl, {
    proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
    proxyReqPathResolver: function (req) {
      var originalUrl = req.originalUrl
      originalUrl = originalUrl.replace('/action/', '')
      return require('url').parse(contentServiceBaseUrl + originalUrl).path
    }
  }))

  const addCorsHeaders = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization,' +
      'cid, user-id, x-auth, Cache-Control, X-Requested-With, *')
  
    if (req.method === 'OPTIONS') {
      res.sendStatus(200)
    } else {
      next()
    };
  }

  app.use('/action/review/comment/*', addCorsHeaders,
  proxy(envHelper.PORTAL_EXT_PLUGIN_URL, {
    proxyReqPathResolver: req => {
      return req.originalUrl.replace('/action', '/plugin')
    }
  }))
  app.use('/action/textbook/v1/toc/*', addCorsHeaders,
  proxy(learner_Service_Local_BaseUrl, {
    proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
    proxyReqPathResolver: (req) => {
      var originalUrl = req.originalUrl
      originalUrl = originalUrl.replace('/action/textbook/v1/', '/v1/textbook/')
      return require('url').parse(learner_Service_Local_BaseUrl + originalUrl).path
    }
  }))
  app.post('/action/user/v1/search',
    addCorsHeaders,
    proxyHeaders.verifyToken(),
    permissionsHelper.checkPermission(),
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace('/action/', '')
        return require('url').parse(learnerURL + originalUrl).path
      },
      userResDecorator: (proxyRes, proxyResData, req, res) => {
          if(req.method === 'GET' && proxyRes.statusCode === 404) res.redirect('/')
          return proxyResData;
      }
  }))

  app.use('/action/*', permissionsHelper.checkPermission(), proxy(contentProxyUrl, {
    preserveHostHdr: true,
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyHeaders.decorateRequestHeaders(),
    proxyReqPathResolver: proxyReqPathResolverMethod
  }))

  app.use('/v1/url/fetchmeta', proxy(contentProxyUrl, {
    proxyReqPathResolver: proxyReqPathResolverMethod
  }))
}
