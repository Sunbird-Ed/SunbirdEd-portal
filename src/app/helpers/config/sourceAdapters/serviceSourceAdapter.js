const envHelper = require('../../environmentVariablesHelper')
const apiAuthToken = envHelper.PORTAL_API_AUTH_TOKEN
const request = require('request')
const configReqKey = 'instance.portal'
let configServiceUrl = ''
const _ = require('lodash')

/**
 * Returns a promise which inturn fetches the given config
 * keys with values from config service
 *
 * @param configKey key for which value to be fetched
 */


readConfigsFromConfigSource = function (url, keys) {
  keys = keys.map(function (item) {
    return configReqKey + '/' + item
  })
  return new Promise(function (resolve, reject) {
    const options = {
      url: url,
      method: 'POST',
      json: true,
      headers: {
        'Authorization': 'Bearer ' + apiAuthToken
      },
      body: {
        request: {
          keys: keys
        }
      }
    }
    request(options, function (err, response, body) {
      if (!err && body && body.responseCode === 'OK' && body.result &&
        body.result.keys) {
        resolve(body.result.keys)
      } else {
        reject(err)
      }
    })
  })
}

function ServiceSourceAdapter(url) {
  configServiceUrl = url
  return {
    getConfigs: function (configKeyMap,cb) {
      readConfigsFromConfigSource(configServiceUrl, _.keys(configKeyMap))
        .then(function (configKeys) {
          let configs = {}
          _.forOwn(configKeyMap, function (envKey, configKey) {
            configKey = configReqKey + '/' + configKey
            if (configKeys && configKeys.hasOwnProperty(configKey)) {
              configs[envKey] = configKeys[configKey]
            } else {
              configs[envKey] = null
            }
          })
          cb(null, configs)
        }, function (err) {
          cb(err, null)
        })
    }
  }
}

module.exports = ServiceSourceAdapter
