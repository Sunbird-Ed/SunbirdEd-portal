const envHelper = require('../environmentVariablesHelper.js')
const configURL = envHelper.CONFIG_URL
const apiAuthToken = envHelper.PORTAL_API_AUTH_TOKEN
const _ = require('lodash')
const request = require('request')
const configModel = require('./configuration')
const cron = require('node-cron');
const configServiceEnabled = envHelper.CONFIG_SERVICE_ENABLED
let configRefreshInterval = envHelper.CONFIG_REFRESH_INTERVAL
let cacheRefreshEnabled = false
const configReqKey = 'instance.portal'

// left side 'key' is the configuration service key and right side 'value' is the envhelper key
const configMap = {
  sunbird_autocreate_trampoline_user: 'PORTAL_AUTOCREATE_TRAMPOLINE_USER',
  sunbird_enable_permission_check: 'ENABLE_PERMISSION_CHECK',
  sunbird_instance_name: 'PORTAL_TITLE_NAME',
  sunbird_theme: 'PORTAL_THEME',
  sunbird_default_language: 'PORTAL_DEFAULT_LANGUAGE',
  sunbird_primary_bundle_language: 'PORTAL_PRIMARY_BUNDLE_LANGUAGE',
  sunbird_explore_button_visibility: 'EXPLORE_BUTTON_VISIBILITY',
  sunbird_enable_signup: 'ENABLE_SIGNUP',
  sunbird_extcont_whitelisted_domains: 'SUNBIRD_EXTCONT_WHITELISTED_DOMAINS',
  sunbird_portal_user_upload_ref_link: 'PORTAL_USER_UPLOAD_REF_LINK'
}

/**
 * Returns a promise which in turn fetches and sets all the configurations mentioned 
 * in the 'configMap' variable
 */
fetchConfig = function () {
  return new Promise(function (resolve, reject) {
    let configs = {}
    if (configServiceEnabled) {
      readConfigs(configReqKey).then(function (configObj) {
        console.log('Info: Configurations fetched from API successfully')
        resolve(checkAndStoreConfigs(configObj))
      }, function (err) {
        console.log('Info: Configurations falling back to environment variables due to error in fetching config from API')
        resolve(checkAndStoreConfigs(configs))
      })
      if (!cacheRefreshEnabled) {
        scheduleConfigRefreshJob()
      }
    } else {
      console.log('Info: Configurations falling back to environment variables as "CONFIG_SERVICE_ENABLED" is not set to true')
      resolve(checkAndStoreConfigs(configs))
    }
  })
}

/**
 * Checks each and every config of 'configMap' with the fetched configuration keys 
 * and adds them if config is present else adds the config value from enviroment variables
 * 
 * @param configs fetched configurations from config service
 */
checkAndStoreConfigs = function (configs) {
  _.forOwn(configMap, function (envKey, configKey) {
    configModel.set(envKey, configs[configKey] || envHelper[envKey])
  })
}

/**
 * Returns a promise which inturn fetches the given config 
 * keys with values from config service
 * 
 * @param configKeys array of configurations to be fetched
 */
readConfigs = function (configKeys) {
  return new Promise(function (resolve, reject) {
    let options = {
      url: configURL + 'v1/read',
      method: 'POST',
      json: true,
      headers: {
        'Authorization': 'Bearer ' + apiAuthToken
      },
      body: {
        request: {
          keys: [configKeys]
        }
      }
    }
    request(options, function (err, response, body) {
      if (!err && body && body.responseCode === 'OK') {
        resolve(body.result.keys[configReqKey])
      } else {
        reject(err)
      }
    })
  })
}


/**
 *  Schedules a cron job to refresh the config data at given intervals
 */
function scheduleConfigRefreshJob() {
  if (configRefreshInterval == undefined || !Number.isInteger(Number(configRefreshInterval)) ||
    configRefreshInterval < 1 || configRefreshInterval > 59) {
    configRefreshInterval = 10
    console.log('Warning: "CONFIG_REFRESH_INTERVAL" should be a valid integer between 1 to 59')
  }
  cron.schedule('0 */' + configRefreshInterval + ' * * * *', () => {
    fetchConfig().then(function (configStatus) {
      console.log('Refreshed configurations from config service')
    })
  })
  cacheRefreshEnabled = true
}

/**
 * Get the given config value from 'configModel'
 * @param configKey name of the configuration to be read
 */
getConfig = function (configKey) {
  let configValue = configModel.get(configKey) || envHelper[configKey]
  return configValue
}

module.exports = {
  fetchConfig: fetchConfig,
  getConfig: getConfig
}
