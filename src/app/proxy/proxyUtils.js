const envHelper = require('./../helpers/environmentVariablesHelper.js')
const appId = envHelper.APPID
const sunbirdApiAuthToken = envHelper.PORTAL_API_AUTH_TOKEN
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const _ = require('lodash')
const ApiInterceptor = require('sb_api_interceptor')

const keyCloakConfig = {
  'authServerUrl': envHelper.PORTAL_AUTH_SERVER_URL,
  'realm': envHelper.KEY_CLOAK_REALM,
  'clientId': envHelper.PORTAL_AUTH_SERVER_CLIENT,
  'public': envHelper.KEY_CLOAK_PUBLIC
}

const cacheConfig = {
  store: envHelper.sunbird_cache_store,
  ttl: envHelper.sunbird_cache_ttl
}

const apiInterceptor = new ApiInterceptor(keyCloakConfig, cacheConfig)

const decorateRequestHeaders = function () {
  return function (proxyReqOpts, srcReq) {
    var channel = _.get(srcReq, 'session.rootOrghashTagId') || _.get(srcReq, 'headers.X-Channel-Id') || envHelper.DEFAULT_CHANNEL
    if (channel && !srcReq.get('X-Channel-Id')) {
      proxyReqOpts.headers['X-Channel-Id'] = channel
    }
    if (srcReq.session) {
      var userId = srcReq.session.userId
      if (userId) { proxyReqOpts.headers['X-Authenticated-Userid'] = userId }
    }
    if(!srcReq.get('X-App-Id')){
      proxyReqOpts.headers['X-App-Id'] = appId
    }
    if (srcReq.kauth && srcReq.kauth.grant && srcReq.kauth.grant.access_token &&
    srcReq.kauth.grant.access_token.token) {
      proxyReqOpts.headers['x-authenticated-user-token'] = srcReq.kauth.grant.access_token.token
    }
    proxyReqOpts.headers.Authorization = 'Bearer ' + sunbirdApiAuthToken
    proxyReqOpts.rejectUnauthorized = false
    return proxyReqOpts
  }
}

const decoratePublicRequestHeaders = function () {
  return function (proxyReqOpts, srcReq) {
    proxyReqOpts.headers['X-App-Id'] = appId
    proxyReqOpts.headers.Authorization = 'Bearer ' + sunbirdApiAuthToken
    return proxyReqOpts
  }
}

function verifyToken () {
  return async (req, res, next) => {
    try {
      await validateUserToken(req, res)
      next()
    } catch (error) {
      const responseCode = 'UNAUTHORIZED_ACCESS';
      res.status(401)
      res.send({
        'id': 'api.error',
        'ver': '1.0',
        'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        'params': {
          'resmsgid': uuidv1(),
          'msgid': null,
          'status': 'failed',
          'err': _.get(error, 'err') || 'INVALID_TOKEN',
          'errmsg': _.get(error, 'err') || 'Access denied'
        },
        'responseCode': responseCode,
        'result': {}
      })
      res.end()
    }
  }
}
function validateUserToken (req, res, next) {
  var token = _.get(req, 'kauth.grant.access_token.token') || req.get('x-authenticated-user-token')
  if (!token) {
    return Promise.reject({
      err: 'TOKEN_MISSING',
      errmsg: 'Required field token is missing'
    });
  }
  return new Promise((resolve, reject) => {
    apiInterceptor.validateToken(token, (err, tokenData) => {
      if (err) {
        reject({
          err: 'INVALID_TOKEN',
          errmsg: 'Access denied'
        })
      } else {
        resolve()
      }
    })
  });
}
const handleSessionExpiry = (proxyRes, proxyResData, req, res, data) => {
  if ((proxyRes.statusCode === 401) && !req.session.userId) {
      return {
        id: 'app.error',
        ver: '1.0',
        ts: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        params:
        {
            'resmsgid': uuidv1(),
            'msgid': null,
            'status': 'failed',
            'err': 'SESSION_EXPIRED',
            'errmsg': 'Session Expired'
        },
        responseCode: 'SESSION_EXPIRED',
        result: { }
    };
  } else {
    return proxyResData;
  }
}
// middleware to add CORS headers
const addCorsHeaders =  (req, res, next) => {
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
module.exports.decorateRequestHeaders = decorateRequestHeaders
module.exports.decoratePublicRequestHeaders = decoratePublicRequestHeaders
module.exports.verifyToken = verifyToken
module.exports.validateUserToken = validateUserToken
module.exports.handleSessionExpiry = handleSessionExpiry
module.exports.addCorsHeaders = addCorsHeaders
