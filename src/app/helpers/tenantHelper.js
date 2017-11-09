const fs = require('fs')
const path = require('path')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const envHelper = require('./environmentVariablesHelper.js')
const defaultTenant = envHelper.DEFAUULT_TENANT

module.exports = {
  getInfo: function (req, res) {
    let tenantId = req.params.tenantId || envHelper.DEFAUULT_TENANT
    let host = req.hostname
    let headerHost = req.headers.host.split(':')
    let port = headerHost[1] || ''
    let protocol = req.headers['x-forwarded-proto'] || req.protocol
    let baseUrl = protocol + '://' + host + (port === '' ? '' : ':' + port)

    let responseObj = {
      logo: baseUrl + '/common/images/sunbird_logo.png',
      favicon: baseUrl + '/common/images/favicon.ico',
      poster: baseUrl + '/common/images/sunbird_logo.png',
      titleName: envHelper.PORTAL_TITLE_NAME
    }

    console.log('baseUrl ', baseUrl)
    // TODO: make file checking async for performance
    if (tenantId) {
      if (fs.existsSync(path.join(__dirname, '../tenant', tenantId, 'logo.png'))) {
        responseObj.logo = baseUrl + '/tenant/' + tenantId + '/logo.png'
      }
      if (fs.existsSync(path.join(__dirname, '../tenant', tenantId, 'favicon.ico'))) {
        responseObj.favicon = baseUrl + '/tenant/' + tenantId + '/favicon.ico'
      }
      if (fs.existsSync(path.join(__dirname, '../tenant', tenantId, 'poster.png'))) {
        responseObj.poster = baseUrl + '/tenant/' + tenantId + '/poster.png'
      }
      module.exports.getSucessResponse(res, 'api.tenant.info', responseObj)
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
  },
  getErrorResponse: function (res) {
    res.status(404)
    res.send({
      'id': 'api.error',
      'ver': '1.0',
      'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
      'params': {
        'resmsgid': uuidv1(),
        'msgid': null,
        'status': 'failed',
        'err': 'NOT_FOUND',
        'errmsg': 'Unable to find resourse requested.'
      },
      'responseCode': 'NOT_FOUND',
      'result': {}
    })
    res.end()
  }
}
