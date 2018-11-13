const request = require('request')
const _ = require('lodash')
const Joi = require('joi')

let configPrefix = ''
let removePrefixAfterFetch = false
let httpOptions = {}
let httpOptionsSchema = Joi.object().keys({
  url: Joi.string().required(),
  method: Joi.string().required().only(['POST']),
  json: Joi.boolean().required().only(true),
  headers: Joi.object().keys({
    authorization: Joi.string().required()
  }).required(),
  body: Joi.object().optional()
})

/**
 * Returns a promise which inturn fetches the given configs
 * from config service as key values
 *
 * @param keys Array of keys for which config values to be fetched
 *
 */

readConfigsFromConfigSource = function (keys) {

  return new Promise(function (resolve, reject) {
    let options = _.cloneDeep(httpOptions)
    if (configPrefix) {
      keys = keys.map(function (i) {
        return configPrefix + i
      })
    }
    options.body = {
      request: {
        keys: {
          instance: keys
        }
      }
    }
    request(options, function (err, response, body) {
      if (!err && body && body.responseCode === 'OK' && body.result &&
        body.result.keys && body.result.keys.instance) {
        resolve(body.result.keys.instance)
      } else {
        reject(err)
      }
    })
  })
}

/**
 * Fetches configurations for given keys from API and triggers callback
 * @param {*} keys list of keys to read as Array
 * @param {*} cb callback to execute after fetching
 */
function getConfigs(keys, cb) {
  readConfigsFromConfigSource(keys)
    .then(function (configKeys) {
        let configs = {}
        _.forOwn(configKeys, function (value, key) {
          if (removePrefixAfterFetch === true) {
            key = key.replace(configPrefix, '')
          }
          configs[key] = value
        })
        cb(null, configs)
      },
      function (err) {
        cb(err, null)
      })
}

function ServiceSourceAdapter(options, prefix, isRemovePrefix) {
  const optionsValidation = Joi.validate(options, httpOptionsSchema)
  if (optionsValidation.error && optionsValidation.error.message) {
    throw optionsValidation.error
  }
  httpOptions = options
  configPrefix = prefix
  removePrefixAfterFetch = isRemovePrefix
  this.getConfigs = getConfigs
}

module.exports = ServiceSourceAdapter
