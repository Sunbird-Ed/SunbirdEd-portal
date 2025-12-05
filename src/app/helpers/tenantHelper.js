const fs = require('fs')
const path = require('path')
const dateFormat = require('dateformat')
const { v1: uuidv1 } = require('uuid')
const envHelper = require('./environmentVariablesHelper.js')
const async = require('async')
const _ = require('lodash')
const { logger } = require('@project-sunbird/logger');
const telemetryHelper = require('./telemetryHelper')
const appId = envHelper.APPID
const defaultTenant = envHelper.DEFAULT_CHANNEL
const telemtryEventConfig = JSON.parse(fs.readFileSync(path.join(__dirname, './telemetryEventConfig.json')))
telemtryEventConfig['pdata']['id'] = appId
const successResponseStatusCode = 200
const request = require('request');
const CacheManager = require('sb_cache_manager')
const cacheManager = new CacheManager({ ttl: Number(envHelper.RESPONSE_CACHE_TTL) * 60, store: envHelper.CACHE_STORE })

module.exports = {

  getImagePath: function (baseUrl, tenantId, image, callback) {
    if (envHelper.TENANT_CDN_URL === '' || envHelper.TENANT_CDN_URL === null) {
      module.exports.getLocalImage(baseUrl, tenantId, image, callback)
    } else {
      request
        .get(envHelper.TENANT_CDN_URL + '/' + tenantId + '/' + image)
        .on('response', function (res) {
          if (res.statusCode === 200) {
            baseUrl = envHelper.TENANT_CDN_URL
            callback(null, baseUrl + '/' + tenantId + '/' + image)
          } else {
            module.exports.getLocalImage(baseUrl, tenantId, image, callback)
          }
        })
    }
  },
  getLocalImage: function (baseUrl, tenantId, image, callback) {
    fs.stat(path.join(__dirname, '../tenant', tenantId, image), function (err, stat) {
      if (err) {
        if (envHelper.DEFAULT_CHANNEL && _.isString(envHelper.DEFAULT_CHANNEL)) {
          fs.stat(path.join(__dirname, '../tenant', envHelper.DEFAULT_CHANNEL, image), function (error, stat) {
            if (error) {
              callback(null, null)
            } else {
              callback(null, baseUrl + '/tenant/' + envHelper.DEFAULT_CHANNEL + '/' + image)
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
    let tenantId = req.params.tenantId || envHelper.DEFAULT_CHANNEL
    req.tenantId = tenantId
    cacheManager.get(tenantId, (err, cacheData) => {
      if (err) console.log('error while fetching the tenant cache data', err);
      if (cacheData) {
        let newCacheData = { ...cacheData };
        newCacheData.ts = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo');
        newCacheData.params.resmsgid = uuidv1();
        res.send(newCacheData)
        res.end()
      }
      else {
        let host = req.hostname
        let headerHost = req.headers.host.split(':')
        let port = headerHost[1] || ''
        let protocol = req.headers['x-forwarded-proto'] || req.protocol
        let baseUrl = protocol + '://' + host + (port === '' ? '' : ':' + port)
        let responseObj = {
          titleName: envHelper.sunbird_instance_name
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
            if (err) { }
            responseObj.logo = results.logo
              ? results.logo : baseUrl + '/assets/images/sunbird_logo.png'
            responseObj.poster = results.poster
              ? results.poster : baseUrl + '/assets/images/sunbird_logo.png'
            responseObj.favicon = results.favicon
              ? results.favicon : baseUrl + '/assets/images/favicon.ico'
            responseObj.appLogo = results.appLogo
              ? results.appLogo : responseObj.logo
            module.exports.getSucessResponse(res, 'api.tenant.info', responseObj, req)
          })
        } else {
          module.exports.getSucessResponse(res, 'api.tenant.info', responseObj, req)
        }
      }
    })
  },
  getSucessResponse: function (res, id, result, req) {
    let tenantId = req.tenantId
    const  uri = 'tenant/info'
    telemetryHelper.logAPIAccessEvent(req, result, uri)
    res.status(successResponseStatusCode)
    let response = {
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
    }
    /* istanbul ignore next  */
    cacheManager.set({ key: tenantId, value: response }, (err, resp) => {
      if (err) console.log('Error while setting the tenant cache', err);
      res.send(response)
      res.end()
    })
  },
  getDefaultTenantIndexState: function () {
    if (!defaultTenant) {
      console.log('DEFAULT_CHANNEL env not set');
      return false;
    }
    try {
      var stats = fs.statSync(path.join(__dirname, '../tenant', defaultTenant, 'index.html'))
      return stats.isFile()
    } catch (e) {
      logger.error({msg: 'tenantHelper : DEFAULT_CHANNEL_index_file_stats_error', error: e});
      return false;
    }
  }
}

