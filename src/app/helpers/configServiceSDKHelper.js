const configClientJsSdk = require('config-client-js-sdk')
const envHelper = require('./environmentVariablesHelper.js')

const cfgUtil = configClientJsSdk.configUtil
const cfgAdapters = configClientJsSdk.Adapters
const configKeys = ['sunbird_instance_name', 'sunbird_theme', 'sunbird_default_language',
  'sunbird_primary_bundle_language', 'sunbird_explore_button_visibility', 'sunbird_enable_signup',
  'sunbird_extcont_whitelisted_domains', 'sunbird_portal_user_upload_ref_link'
]

let cfgOptions = {
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
    authorization: 'Bearer '+ envHelper.PORTAL_API_AUTH_TOKEN
  },
  json: true
}
cfgOptions.sources.push(new cfgAdapters.ServiceSourceAdapter(httpOptions, 'portal.', true))
cfgOptions.sources.push(new cfgAdapters.EnvVarSourceAdapter(envHelper))

const cfgBuilder = new configClientJsSdk.ConfigBuilder(cfgOptions)

module.exports = {
  getConfig: function (key) {
    return cfgUtil.getConfig(key)
  },
  init: function () {
    return cfgBuilder.buildConfig()
  }
}
