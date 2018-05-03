const envHelper = require('./../helpers/environmentVariablesHelper.js')
const appId = envHelper.APPID
const sunbirdApiAuthToken = envHelper.PORTAL_API_AUTH_TOKEN
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const _ = require('lodash')

const decorateRequestHeaders = function () {
  return function (proxyReqOpts, srcReq) {
    var channel = _.get(srcReq, 'session.rootOrghashTagId') || _.get(srcReq, 'headers.X-Channel-Id')
    if (channel) {
      proxyReqOpts.headers['X-Channel-Id'] = channel
    }
    if (srcReq.session) {
      var userId = srcReq.session.userId
      if (userId) { proxyReqOpts.headers['X-Authenticated-Userid'] = userId }
    }
    proxyReqOpts.headers['X-App-Id'] = appId
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
