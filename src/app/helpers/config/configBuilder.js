const _ = require('lodash')
const cron = require('node-cron');
let configSources = []
let configKeyMap = {}
let cacheRefreshEnabled = false
const configHelper = require('./configHelper.js')

/**
 * builds the configuration from the added config sources
 * @param cacheRefreshInterval time interval to update the config cache
 */
buildConfig = function (cacheRefreshInterval) {
  return new Promise(function (resolve, reject) {
    recursiveFetch(configSources, configKeyMap, {}, 0, function (configs) {
      configHelper.loadConfigData(configs)
      if (cacheRefreshEnabled == false) {
        scheduleConfigRefreshJob(cacheRefreshInterval)
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
 * @param keyMap configuration keys object
 * @param configData object to store the fetched config data
 * @param index position of the current config source in list
 * @param cb callback to call after fetching all config keys
 *
 */
recursiveFetch = function (sourceList, keyMap, configData, index, cb) {
  if (index < sourceList.length && _.keys(keyMap).length > 0) {
    let configSource = sourceList[index]
    configSource.getConfigs(keyMap, function (err, configs) {
      if (err) {
        console.log("error in getting configurations from source ", configSource, " err", err)
      } else {
        _.assign(configData, _.pickBy(configs, v => v !== null && v !== undefined))
        keyMap = _.pickBy(keyMap, function (value, key) {
          return (configData[value] === null || configData[value] === undefined)
        });
      }
      recursiveFetch(sourceList, keyMap, configData, index + 1, cb)
    })
  } else {
    cb(configData)
  }
}


/**
 *  Schedules a cron job to refresh the config data at given intervals
 */
function scheduleConfigRefreshJob(configRefreshInterval) {
  if (configRefreshInterval == undefined || !Number.isInteger(Number(configRefreshInterval)) ||
    configRefreshInterval < 1 || configRefreshInterval > 59) {
    configRefreshInterval = 10
    console.log('Warning: "CONFIG_REFRESH_INTERVAL" should be a valid integer between 1 to 59')
  }
  cron.schedule('0 */' + configRefreshInterval + ' * * * *', () => {
    buildConfig().then(function (configStatus) {
      console.log('Refreshed configurations from config service')
    })
  })
  cacheRefreshEnabled = true
}

addConfigSource = function (src) {
  configSources.push(src)
}

function ConfigBuilder(keyMap) {
  configKeyMap = keyMap
  return {
    buildConfig: buildConfig,
    addConfigSource: addConfigSource
  }
}
module.exports = ConfigBuilder
