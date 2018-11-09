let configData = {}
let _ = require('lodash')
/**
 * Get the given config value from 'configData'
 * @param configKey name of the configuration to be read
 */
getConfig = function (configKey) {
  return configData[configKey]
}

/**
 * loads the given data into the configurations
 * @param configs list of configurations to be saved
 */
loadConfigData = function(configs){
  configData = configs
  console.log(_.keys(configs).length+' configurations loaded')
}

module.exports = {
  getConfig: getConfig,
  loadConfigData: loadConfigData
}
