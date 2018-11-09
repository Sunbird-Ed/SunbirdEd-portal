const _ = require('lodash')
let envHelper = {}

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