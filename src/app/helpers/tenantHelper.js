const fs = require('fs')
const path = require('path')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const envHelper = require('./environmentVariablesHelper.js')
const async = require('async')
const _ = require('lodash')
const telemetryHelper = require('./telemetryHelper')
const appId = envHelper.APPID
const telemtryEventConfig = JSON.parse(fs.readFileSync(path.join(__dirname, './telemetryEventConfig.json')))
telemtryEventConfig['pdata']['id'] = appId
const successResponseStatusCode = 200

module.exports = {

  getImagePath: function (baseUrl, tenantId, image, callback) {
    fs.stat(path.join(__dirname, '../tenant', tenantId, image), function (err, stat) {
      if (err) {
        if (envHelper.DEFAUULT_TENANT && _.isString(envHelper.DEFAUULT_TENANT)) {
          fs.stat(path.join(__dirname, '../tenant', envHelper.DEFAUULT_TENANT, image), function (error, stat) {
            if (error) {
              callback(null, null)
            } else {
              callback(null, baseUrl + '/tenant/' + envHelper.DEFAUULT_TENANT + '/' + image)
            }
          })
        } else {
          callback(null, null)
        }
      } else {
        callback(null, baseUrl + '/tenant/' + tenantId + '/' + image)
      }
    })
  },
  getInfo: function (req, res) {
    let tenantId = req.params.tenantId || envHelper.DEFAUULT_TENANT
    let host = req.hostname
    let headerHost = req.headers.host.split(':')
    let port = headerHost[1] || ''
    let protocol = req.headers['x-forwarded-proto'] || req.protocol
    let baseUrl = protocol + '://' + host + (port === '' ? '' : ':' + port)

    let responseObj = {
      titleName: envHelper.PORTAL_TITLE_NAME
    }
    if (tenantId) {
      async.parallel({
        logo: function (callback) {
          module.exports.getImagePath(baseUrl, tenantId, 'logo.png', callback)
        },
        poster: function (callback) {
          module.exports.getImagePath(baseUrl, tenantId, 'poster.png', callback)
        },
        favicon: function (callback) {
          module.exports.getImagePath(baseUrl, tenantId, 'favicon.ico', callback)
        },
        appLogo: function (callback) {
          module.exports.getImagePath(baseUrl, tenantId, 'appLogo.png', callback)
        }
      }, function (err, results) {
        if (err) {}
        responseObj.logo = results.logo
          ? results.logo : baseUrl + '/common/images/sunbird_logo.png'
        responseObj.poster = results.poster
          ? results.poster : baseUrl + '/common/images/sunbird_logo.png'
        responseObj.favicon = results.favicon
          ? results.favicon : baseUrl + '/common/images/favicon.ico'
        responseObj.appLogo = results.appLogo
          ? results.appLogo : responseObj.logo
        module.exports.getSucessResponse(res, 'api.tenant.info', responseObj, req)
      })
    } else {
      module.exports.getSucessResponse(res, 'api.tenant.info', responseObj, req)
    }
  },
  getSucessResponse: function (res, id, result, req) {
    const userId = req.headers['x-consumer-id'] || telemtryEventConfig.default_userid
    const type = req.headers['x-consumer-username'] || telemtryEventConfig.default_username

    const telemetryData = {reqObj: req,
      statusCode: successResponseStatusCode,
      resp: result,
      uri: 'tenant/info',
      type: type,
      userId: userId,
      channel: envHelper.DEFAUULT_TENANT
    }
    telemetryHelper.logAPIAccessEvent(telemetryData)
    res.status(successResponseStatusCode)
    res.send({
      'id': id,
      'ver': '1.0',
      'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
      'params': {
        'resmsgid': uuidv1(),
        'msgid': null,
        'status': 'successful',
        'err': '',
        'errmsg': ''
      },
      'responseCode': 'OK',
      'result': result
    })
    res.end()
  }
}
