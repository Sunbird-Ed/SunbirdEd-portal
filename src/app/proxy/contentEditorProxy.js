const utils = require('../helpers/utils.js');
const proxyUtils = require('./proxyUtils.js')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const contentProxyUrl  = utils?.defaultHost(utils?.envVariables?.CONTENT_PROXY_URL);
const learnerServiceBaseUrl  = utils?.defaultHost(utils?.envVariables?.LEARNER_URL);
const learner_Service_Local_BaseUrl = utils?.defaultHost(utils?.envVariables?.learner_Service_Local_BaseUrl);
const PORTAL_EXT_PLUGIN_URL = utils?.defaultHost(utils?.envVariables?.PORTAL_EXT_PLUGIN_URL);
const contentServiceBaseUrl = utils?.defaultHost(utils?.envVariables?.CONTENT_URL);
const reqDataLimitOfContentUpload = '30mb'
const telemetryHelper = require('../helpers/telemetryHelper')
const learnerURL  = utils?.defaultHost(utils?.envVariables?.LEARNER_URL);
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
  proxy(PORTAL_EXT_PLUGIN_URL, {
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
        let originalUrl = req.originalUrl.replace('/action/user/v1/search', 'user/v3/search')
        return require('url').parse(learnerURL + originalUrl).path
      },
      userResDecorator: userResDecorator
    })
  )

  // Question & QuestionSet API's START

  app.get([
    '/action/questionset/v2/read/:do_id',
    '/action/question/v2/read/:do_id',
    '/action/questionset/v2/hierarchy/:do_id'
    ],
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

  app.post([
    '/action/questionset/v2/create',
    '/action/questionset/v2/review/:do_id',
    '/action/questionset/v2/publish/:do_id',
    '/action/questionset/v2/reject/:do_id',
    '/action/question/v2/create',
    '/action/question/v2/review/:do_id',
    '/action/question/v2/publish/:do_id',
    '/action/question/v2/list'
    ],
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

  app.patch([
    '/action/questionset/v2/hierarchy/update',
    '/action/questionset/v2/update/:do_id',
    '/action/questionset/v2/add',
    '/action/question/v2/update/:do_id'
    ],
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

  app.post('/action/object/category/definition/v1/read',
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

  // Question & QuestionSet API's END

  // Collection import & export API's start
  app.post([
    '/action/collection/v1/import/:do_id'
    ],
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
  app.get([
    '/action/collection/v1/export/:do_id'
    ],
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
  // Collection import & export API's END

  app.post('/action/content/v3/upload/*',
    isAPIWhitelisted.isAllowed(),
    proxy(contentProxyUrl, {
      preserveHostHdr: true,
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentProxyUrl),
      proxyReqPathResolver: proxyReqPathResolverMethod,
      userResDecorator: userResDecorator
    })
  )
  // asset create , upload and read api's
  app.post('/action/asset/v1/upload/:do_id',
    isAPIWhitelisted.isAllowed(),
    proxy(contentServiceBaseUrl, {
      preserveHostHdr: true,
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentServiceBaseUrl),
      proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace('/action/', '')
        return require('url').parse(contentServiceBaseUrl + originalUrl).path
      },
      userResDecorator: userResDecorator
    })
  )
  app.post('/action/asset/v1/create',
    isAPIWhitelisted.isAllowed(),
    proxy(contentServiceBaseUrl, {
      preserveHostHdr: true,
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentServiceBaseUrl),
      proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace('/action/', '')
        return require('url').parse(contentServiceBaseUrl + originalUrl).path
      },
      userResDecorator: userResDecorator
    })
  )
  app.get('/action/asset/v1/read/:do_id',
  isAPIWhitelisted.isAllowed(),
  proxy(contentServiceBaseUrl, {
    preserveHostHdr: true,
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(contentServiceBaseUrl),
    proxyReqPathResolver: function (req) {
      let originalUrl = req.originalUrl.replace('/action/', '')
      return require('url').parse(contentServiceBaseUrl + originalUrl).path
    },
    userResDecorator: userResDecorator
  })
)
  // asset api's  ends

  app.all('/action/*',
  bodyParser.json({ limit: '50mb' }),
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
