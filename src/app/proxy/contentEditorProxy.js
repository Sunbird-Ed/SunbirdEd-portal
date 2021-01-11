const proxyUtils = require('./proxyUtils.js')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const envHelper = require('./../helpers/environmentVariablesHelper.js')
const contentProxyUrl = envHelper.CONTENT_PROXY_URL
const learnerServiceBaseUrl = envHelper.LEARNER_URL
const learner_Service_Local_BaseUrl = envHelper.learner_Service_Local_BaseUrl
const contentServiceBaseUrl = envHelper.CONTENT_URL
const reqDataLimitOfContentUpload = '30mb'
const telemetryHelper = require('../helpers/telemetryHelper')
const learnerURL = envHelper.LEARNER_URL
const isAPIWhitelisted = require('../helpers/apiWhiteList');

module.exports = function (app) {

  const proxyReqPathResolverMethod = function (req) {
    return require('url').parse(contentProxyUrl + req.originalUrl).path
  }
  app.all('/plugins/v1/search', proxy(contentServiceBaseUrl, {
    preserveHostHdr: true,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentServiceBaseUrl),
    proxyReqPathResolver: function (req) {
      var originalUrl = req.originalUrl
      originalUrl = originalUrl.replace('/', '')
      return require('url').parse(contentServiceBaseUrl + originalUrl).path
    }
  }))

  app.all('/content-plugins/*', proxy(contentProxyUrl, {
    preserveHostHdr: true,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentProxyUrl),
    proxyReqPathResolver: proxyReqPathResolverMethod
  }))

  app.all('/plugins/*', proxy(contentProxyUrl, {
    preserveHostHdr: true,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentProxyUrl),
    proxyReqPathResolver: proxyReqPathResolverMethod
  }))

  app.all('/assets/public/*', proxy(contentProxyUrl, {
    preserveHostHdr: true,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentProxyUrl),
    proxyReqPathResolver: proxyReqPathResolverMethod
  }))

  app.all('/content/preview/*', proxy(contentProxyUrl, {
    preserveHostHdr: true,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentProxyUrl),
    proxyReqPathResolver: proxyReqPathResolverMethod
  }))

  app.all('/action/content/v3/unlisted/publish/:contentId',
    bodyParser.json(),
    isAPIWhitelisted.isAllowed(),
    proxy(contentProxyUrl, {
      preserveHostHdr: true,
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentProxyUrl),
      proxyReqPathResolver: proxyReqPathResolverMethod,
      proxyReqBodyDecorator: function (bodyContent, srcReq) {
        if (bodyContent && bodyContent.request && bodyContent.request.content) {
          bodyContent.request.content.baseUrl = srcReq.protocol + '://' + srcReq.headers.host
        }
        return bodyContent
      }
    }))

  app.all('/action/data/v1/page/assemble',
  isAPIWhitelisted.isAllowed(),
  proxy(learnerServiceBaseUrl, {
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(learnerServiceBaseUrl),
    proxyReqPathResolver: function (req) {
      var originalUrl = req.originalUrl
      originalUrl = originalUrl.replace('/action/', '')
      return require('url').parse(learnerServiceBaseUrl + originalUrl).path
    }
  }))


  app.all('/action/data/v1/form/read',
  isAPIWhitelisted.isAllowed(),
  proxy(contentServiceBaseUrl, {
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentServiceBaseUrl),
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

  app.all('/action/review/comment/*',
  isAPIWhitelisted.isAllowed(),
  addCorsHeaders,
  proxy(envHelper.PORTAL_EXT_PLUGIN_URL, {
    proxyReqPathResolver: req => {
      return req.originalUrl.replace('/action', '/plugin')
    },
    userResDecorator: userResDecorator
  }))

  app.all('/action/textbook/v1/toc/*',
  isAPIWhitelisted.isAllowed(),
  addCorsHeaders,
  proxy(learnerURL, {
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(learnerURL),
    proxyReqPathResolver: (req) => {
      var originalUrl = req.originalUrl
      originalUrl = originalUrl.replace('/action/textbook/v1/', 'textbook/v1/')
      return require('url').parse(learnerURL + originalUrl).path
    },
    userResDecorator: userResDecorator
  }))

  app.post('/action/user/v1/search',
    isAPIWhitelisted.isAllowed(),
    addCorsHeaders,
    proxyUtils.verifyToken(),
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(learnerURL),
      proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace('/action/', '')
        return require('url').parse(learnerURL + originalUrl).path
      },
      userResDecorator: userResDecorator
    })
  )
  app.all('/action/*',
  bodyParser.json(),
  isAPIWhitelisted.isAllowed(),
  telemetryHelper.generateTelemetryForProxy,
  proxy(contentProxyUrl, {
    preserveHostHdr: true,
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentProxyUrl),
    proxyReqPathResolver: proxyReqPathResolverMethod,
    userResDecorator: userResDecorator
  }))

  app.all('/v1/url/fetchmeta', proxy(contentProxyUrl, {
    proxyReqPathResolver: proxyReqPathResolverMethod
  }))
}
const userResDecorator = (proxyRes, proxyResData, req, res) => {
  try {
      const data = JSON.parse(proxyResData.toString('utf8'));
      if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
      else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
  } catch(err) {
      console.log('content api user res decorator json parse error', proxyResData);
      return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
  }
}
