const fs = require('fs')
const path = require('path')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const envHelper = require('./environmentVariablesHelper.js')
const async = require('async')
const _ = require('lodash')

module.exports = {
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
          fs.stat(path.join(__dirname, '../tenant', tenantId, 'logo.png'), function (err, stat) {
            if (err && envHelper.DEFAUULT_TENANT && _.isString(envHelper.DEFAUULT_TENANT)) {
              fs.stat(path.join(__dirname, '../tenant', envHelper.DEFAUULT_TENANT, 'logo.png'), function (err, stat) {
                if (err) {}
                callback(null, stat)
              })
            } else {
              callback(null, stat)
            }
          })
        },
        poster: function (callback) {
          fs.stat(path.join(__dirname, '../tenant', tenantId, 'poster.png'), function (err, stat) {
            if (err && envHelper.DEFAUULT_TENANT && _.isString(envHelper.DEFAUULT_TENANT)) {
              fs.stat(path.join(__dirname, '../tenant', envHelper.DEFAUULT_TENANT, 'poster.png'), function (err, stat) {
                if (err) {}
                callback(null, stat)
              })
            } else {
              callback(null, stat)
            }
          })
        },
        favicon: function (callback) {
          fs.stat(path.join(__dirname, '../tenant', tenantId, 'favicon.ico'), function (err, stat) {
            if (err && envHelper.DEFAUULT_TENANT && _.isString(envHelper.DEFAUULT_TENANT)) {
              fs.stat(path.join(__dirname, '../tenant', envHelper.DEFAUULT_TENANT, 'favicon.ico'),
                function (err, stat) {
                  if (err) {}
                  callback(null, stat)
                })
            } else {
              callback(null, stat)
            }
          })
        },
        appLogo: function (callback) {
          fs.stat(path.join(__dirname, '../tenant', tenantId, 'appLogo.png'), function (err, stat) {
            if (err && envHelper.DEFAUULT_TENANT && _.isString(envHelper.DEFAUULT_TENANT)) {
              fs.stat(path.join(__dirname, '../tenant', envHelper.DEFAUULT_TENANT, 'appLogo.png'),
                function (err, stat) {
                  if (err) {}
                  callback(null, stat)
                })
            } else {
              callback(null, stat)
            }
          })
        }
      }, function (err, results) {
        if (err) {}
        responseObj.logo = baseUrl + (results.logo
          ? '/tenant/' + tenantId + '/logo.png' : '/common/images/sunbird_logo.png')
        responseObj.poster = baseUrl + (results.poster
          ? '/tenant/' + tenantId + '/poster.png' : '/common/images/sunbird_logo.png')
        responseObj.favicon = baseUrl + (results.favicon
          ? '/tenant/' + tenantId + '/favicon.ico' : '/common/images/favicon.ico')
        responseObj.appLogo = results.appLogo
          ? baseUrl + '/tenant/' + tenantId + '/appLogo.png' : responseObj.logo
        module.exports.getSucessResponse(res, 'api.tenant.info', responseObj)
      })
    } else {
      module.exports.getSucessResponse(res, 'api.tenant.info', responseObj)
    }
  },
  getSucessResponse: function (res, id, result) {
    res.status(200)
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
