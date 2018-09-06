const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const envHelper = require('./environmentVariablesHelper.js')
const configURL = envHelper.CONFIG_URL
const apiAuthToken = envHelper.PORTAL_API_AUTH_TOKEN
const _ = require('lodash')
const telemetryHelper = require('./telemetryHelper')
const CacheManager = require('sb_cache_manager')
const request = require('request')

let config = {
  ttl: envHelper.CONFIG_CACHE_TTL
}
let cacheMgr = new CacheManager(config)

module.exports = {
  getConfig: function (configKey, envKey, callback) {
    cacheMgr.get(configKey, function (err, configData) {
      if (err || !configData) {
        var options = {
          method: 'GET',
          url: configURL + 'v1/read/' + configKey,
          headers: {
            'x-device-id': 'middleware',
            'x-msgid': uuidv1(),
            'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + apiAuthToken
          },
          json: true
        }

        request(options, function (error, response, body) {
          if (!error && body && body.responseCode === 'OK') {
            let response = body.result[configKey]

            cacheMgr.set({key: configKey, value: response}, function (err, res) { })
            callback(null, response)
          } else if (_.has(envHelper, envKey)) {
            callback(null, envHelper[envKey])
          } else {
            callback({error: true}, null)
          }
        })
      } else {
        callback(null, configData)
      }
    })
  }

}
