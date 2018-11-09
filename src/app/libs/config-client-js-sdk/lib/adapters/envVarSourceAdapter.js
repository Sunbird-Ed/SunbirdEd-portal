const _ = require('lodash')
let envHelper = {}

/**
 * reads the config values for given keys from provided environment helper and triggers callback
 * @param keys list of keys to read
 * @param cb callback to be executes after loading configs
 */
function getConfigs(keys, cb) {
  let configs = {}
  _.forEach(keys, function (key) {
    if (envHelper && envHelper.hasOwnProperty(key)) {
      configs[key] = envHelper[key]
    } else {
      configs[key] = null
    }
  })
  cb(null, configs)
}

function EnvVarSourceAdapter(envSource) {
  envHelper = envSource
  this.getConfigs = getConfigs
}
module.exports = EnvVarSourceAdapter
