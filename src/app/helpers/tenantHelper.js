const fs = require('fs')
const path = require('path')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const envHelper = require('./environmentVariablesHelper.js')
const defaultTenant = envHelper.DEFAUULT_TENANT

module.exports = {
  getInfo: function (req, res) {
    var tenantId = req.params.tenantId || envHelper.DEFAUULT_TENANT
    var responseObj = {
      logo: '/common/images/sunbird_logo.png',
      favicon: '/common/images/favicon.ico',
      poster: '/common/images/sunbird_logo.png',
      titleName: envHelper.PORTAL_TITLE_NAME
    }
    // TODO: make file checking async for performance
    if (tenantId) {
      if (fs.existsSync(path.join(__dirname, '../tenant', tenantId, 'logo.png'))) {
        responseObj.logo = '/tenant/' + tenantId + '/logo.png'
      } else if (defaultTenant && fs.existsSync(path.join(__dirname, '../tenant', defaultTenant, 'logo.png'))) {
        responseObj.logo = '/tenant/' + defaultTenant + '/logo.png'
      }
      if (fs.existsSync(path.join(__dirname, '../tenant', tenantId, 'favicon.ico'))) {
        responseObj.favicon = '/tenant/' + tenantId + '/favicon.ico'
      } else if (defaultTenant && fs.existsSync(path.join(__dirname, '../tenant', defaultTenant, 'favicon.ico'))) {
        responseObj.favicon = '/tenant/' + defaultTenant + '/favicon.ico'
      }
      if (fs.existsSync(path.join(__dirname, '../tenant', tenantId, 'poster.png'))) {
        responseObj.poster = '/tenant/' + tenantId + '/poster.png'
      } else if (defaultTenant && fs.existsSync(path.join(__dirname, '../tenant', defaultTenant, 'poster.png'))) {
        responseObj.poster = '/tenant/' + defaultTenant + '/poster.png'
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
