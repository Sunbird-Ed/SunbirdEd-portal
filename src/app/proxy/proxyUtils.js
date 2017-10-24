const envHelper = require('./../helpers/environmentVariablesHelper.js'),
  appId = envHelper.APPID,
  md5 = require('js-md5'),
  sunbird_api_auth_token = envHelper.PORTAL_API_AUTH_TOKEN

const decorateRequestHeaders = function () {
  return function (proxyReqOpts, srcReq) {
    if (srcReq.session) {
      var userId = srcReq.session.userId
      var channel = md5(srcReq.session.rootOrgId || 'sunbird')
      if (userId) { proxyReqOpts.headers['X-Authenticated-Userid'] = userId }
      proxyReqOpts.headers['X-Channel-Id'] = channel
    }
    proxyReqOpts.headers['X-App-Id'] = appId
    if (srcReq.kauth && srcReq.kauth.grant && srcReq.kauth.grant.access_token && srcReq.kauth.grant.access_token.token) {
      proxyReqOpts.headers['x-authenticated-user-token'] = srcReq.kauth.grant.access_token.token
    }
    proxyReqOpts.headers.Authorization = 'Bearer ' + sunbird_api_auth_token
    proxyReqOpts.rejectUnauthorized = false
    return proxyReqOpts
  }
}

const decoratePublicRequestHeaders = function () {
  return function (proxyReqOpts, srcReq) {
    proxyReqOpts.headers['X-App-Id'] = appId
    proxyReqOpts.headers.Authorization = 'Bearer ' + sunbird_api_auth_token
    return proxyReqOpts
  }
}

function verifyToken () {
  return function (req, res, next) {
    if (!req.session) {
      res.status(440)
      res.send({
        'id': 'api.error',
        'ver': '1.0',
        'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        'params': {
          'resmsgid': uuidv1(),
          'msgid': null,
          'status': 'failed',
          'err': 'LOGIN_TIMEOUT',
          'errmsg': 'Session Expired'
        },
        'responseCode': 'LOGIN_TIMEOUT',
        'result': {}
      })
      res.end()
    } else {
      next()
    }
  }
}

module.exports.decorateRequestHeaders = decorateRequestHeaders
module.exports.decoratePublicRequestHeaders = decoratePublicRequestHeaders
module.exports.verifyToken = verifyToken
