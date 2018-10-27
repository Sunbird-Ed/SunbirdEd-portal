const _ = require('lodash')
let envHelper = {}

function EnvVarSourceAdapter(envSource) {
  envHelper = envSource
  return {
    getConfigs: function (configKeyMap, cb) {
      let configs = {}
      _.forOwn(configKeyMap, function (envKey, configKey) {
        if (envHelper && envHelper.hasOwnProperty(envKey)) {
          configs[envKey] = envHelper[envKey]
        } else {
          configs[envKey] = null
        }
      })
      cb(null, configs)
    }
  }
}
module.exports = EnvVarSourceAdapter
