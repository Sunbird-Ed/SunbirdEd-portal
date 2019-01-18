const configClientJsSdk = require('config-client-js-sdk')
const envHelper = require('./environmentVariablesHelper.js')

const configUtil = configClientJsSdk.configUtil
const configAdapters = configClientJsSdk.Adapters
const configKeys = ['sunbird_instance_name', 'sunbird_theme', 'sunbird_default_language',
  'sunbird_primary_bundle_language', 'sunbird_explore_button_visibility', 'sunbird_enable_signup',
  'sunbird_extcont_whitelisted_domains', 'sunbird_portal_user_upload_ref_link','sunbird_portal_video_max_size']
const authBearer = 'Bearer '
const configPRefix = 'portal.'

let configOptions = {
  sources: [],
  keys: configKeys,
  cacheRefresh: {
    enabled: true,
    interval: envHelper.CONFIG_REFRESH_INTERVAL
  }
}
let httpOptions = {
  url: envHelper.CONFIG_URL+'v1/read',
  method: 'POST',
  headers: {
    authorization: authBearer + envHelper.PORTAL_API_AUTH_TOKEN
  },
  json: true
}
configOptions.sources.push(new configAdapters.ServiceSourceAdapter(httpOptions,configPRefix , true))
configOptions.sources.push(new configAdapters.EnvVarSourceAdapter(envHelper))

const configBuilder = new configClientJsSdk.ConfigBuilder(configOptions)

module.exports = {
  getConfig: function (key) {
    return configUtil.getConfig(key)
  },
  init: function () {
    return configBuilder.buildConfig()
  }
}
