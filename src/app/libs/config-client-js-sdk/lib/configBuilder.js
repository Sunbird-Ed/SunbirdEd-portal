const _ = require('lodash')
const cron = require('node-cron')
const configUtil = require('./configUtil.js')
const Joi = require('joi')
const ServiceSourceAdapter = require('./adapters/serviceSourceAdapter')
const EnvVarSourceAdapter = require('./adapters/envVarSourceAdapter')

let configOptions = {}
const cacheSchema = Joi.object().keys({
  enabled: Joi.boolean().required(),
  interval: Joi.number().default(10)
})
const optionsSchema = Joi.object().keys({
  sources: Joi.array().min(1).required(),
  keys: Joi.array().min(1).required(),
  cacheRefresh: cacheSchema
})
let cronScheduled = false

/**
 * builds the configuration from the added config sources
 * @returns promise which responds with status or error
 */
buildConfig = function () {
  return new Promise(function (resolve, reject) {
    const err = validateConfigOptions()
    if (err) {
      reject(err)
    }
    // Use a callback function handler to load configs into cache and resolve the promise after recursive fetch
    recursiveFetch(configOptions.sources, configOptions.keys, {}, 0, function (configs) {
      configUtil.loadConfigData(configs)
      // schedule cron-job to refresh configurations at specific intervals
      if (configOptions.cacheRefresh && configOptions.cacheRefresh.enabled == true && cronScheduled == false) {
        scheduleConfigRefreshJob(configOptions.cacheRefresh.interval)
      }
      resolve(true)
    })
  })
}

/**
 * Fetch configurations from config sources recursively.
 * if the first config source returns null for a config then pass it to next source.
 *
 * @param sourceList list of config source adapters
 * @param keys configuration keys list
 * @param configData object to store the fetched config data
 * @param index position of the current config source in list
 * @param cb callback to call after fetching all config keys
 *
 */
recursiveFetch = function (sourceList, keys, configData, index, cb) {
  if (index < sourceList.length && keys.length > 0) {
    let configSource = sourceList[index]
    configSource.getConfigs(keys, function (err, configs) {
      if (err) {
        console.log('error in getting configurations from source ', configSource, ' err', err)
      } else {
        _.assign(configData, _.pickBy(configs, v => v !== null && v !== undefined))
        keys = _.filter(keys, function (key) {
          return (configData[key] === null || configData[key] === undefined)
        })
      }
      recursiveFetch(sourceList, keys, configData, index + 1, cb)
    })
  } else {
    if (keys.length > 0) {
      _.forEach(keys, function (key) {
        configData[key] = null
      })
    }
    cb(configData)
  }
}


/**
 *  Schedules a cron job to refresh the config data at given intervals
 *  @param configRefreshInterval Interval at which configurations to be refreshed default : 10 mins
 */
function scheduleConfigRefreshJob(configRefreshInterval) {
  if (configRefreshInterval == undefined || !Number.isInteger(Number(configRefreshInterval)) ||
    configRefreshInterval < 1 || configRefreshInterval > 59) {
    configRefreshInterval = 10
    console.log('Warning: "CONFIG_REFRESH_INTERVAL" should be a valid integer between 1 to 59')
  }
  cron.schedule('0 */' + configRefreshInterval + ' * * * *', () => {
    buildConfig().then(function (configStatus) {
      console.log('Refreshed configurations')
    })
  })
  console.log('Info: config refresh scheduler enabled')
  cronScheduled = true
}

/**
 *  Validates the provided configuration options like sources,keys and
 *  cache refresh options using Joi validator
 */

validateConfigOptions = function () {
  let err = null
  const result = Joi.validate(configOptions, optionsSchema)
  if (result.error && !_.isEmpty(result.error.message)) {
    err = result.error.message
  } else {
    _.forEach(configOptions.sources, function (source, index) {
      if (!(source instanceof ServiceSourceAdapter || source instanceof EnvVarSourceAdapter)) {
        err = 'Invalid config source provided at index:' + index
        return false
      }
    })
  }
  return err
}



function ConfigBuilder(options) {
  configOptions = options
  return {
    buildConfig: buildConfig
  }
}
module.exports = ConfigBuilder
