const envHelper = require('../environmentVariablesHelper.js')
const configURL = envHelper.CONFIG_URL
const apiAuthToken = envHelper.PORTAL_API_AUTH_TOKEN
const _ = require('lodash')
const telemetryHelper = require('../telemetryHelper')
const CacheManager = require('sb_cache_manager')
const request = require('request')
const configModel = require('./configuration')
const cron = require('node-cron');
let config = {
  ttl: envHelper.CONFIG_CACHE_TTL
}
let cacheMgr = new CacheManager(config)
const configServiceEnabled = envHelper.CONFIG_SERVICE_ENABLED
let configRefreshInterval = envHelper.CONFIG_REFRESH_INTERVAL
let cacheRefreshEnabled = false

// left side 'key' is the configuration service key and right side 'value' is the envhelper key
const configMap = {
  'instance.allow_signup': 'ENABLE_SIGNUP',
  sunbird_learner_player_url: 'LEARNER_URL',
  sunbird_content_player_url: 'CONTENT_URL',
  sunbird_config_service_url: 'CONFIG_URL',
  sunbird_content_proxy_url: 'CONTENT_PROXY_URL',
  sunbird_portal_realm: 'PORTAL_REALM',
  sunbird_portal_auth_server_url: 'PORTAL_AUTH_SERVER_URL',
  sunbird_portal_auth_server_client: 'PORTAL_AUTH_SERVER_CLIENT',
  app_id: 'APPID',
  sunbird_default_channel: 'DEFAULT_CHANNEL',
  ekstep_env: 'EKSTEP_ENV',
  sunbird_port: 'PORTAL_PORT',
  sunbird_api_auth_token: 'PORTAL_API_AUTH_TOKEN',
  sunbird_telemetry_packet_size: 'PORTAL_TELEMETRY_PACKET_SIZE',
  sunbird_echo_api_url: 'PORTAL_ECHO_API_URL',
  sunbird_autocreate_trampoline_user: 'PORTAL_AUTOCREATE_TRAMPOLINE_USER',
  sunbird_trampoline_client_id: 'PORTAL_TRAMPOLINE_CLIENT_ID',
  sunbird_trampoline_secret: 'PORTAL_TRAMPOLINE_SECRET',
  sunbird_enabless_permission_check: 'ENABLE_PERMISSION_CHECK',
  sunbird_session_store_type: 'PORTAL_SESSION_STORE_TYPE',
  sunbird_instance: 'PORTAL_TITLE_NAME',
  sunbird_portal_cdn_url: 'PORTAL_CDN_URL',
  sunbird_theme: 'PORTAL_THEME',
  sunbird_portal_default_language: 'PORTAL_DEFAULT_LANGUAGE',
  sunbird_portal_primary_bundle_language: 'PORTAL_PRIMARY_BUNDLE_LANGUAGE',
  sunbird_content_service_upstream_url: 'CONTENT_SERVICE_UPSTREAM_URL',
  sunbird_learner_service_upstream_url: 'LEARNER_SERVICE_UPSTREAM_URL',
  sunbird_dataservice_url: 'DATASERVICE_URL',
  sunbird_keycloak_public: 'KEY_CLOAK_PUBLIC',
  sunbird_keycloak_realm: 'KEY_CLOAK_REALM',
  sunbird_cache_store: 'CACHE_STORE',
  sunbird_cache_ttl: 'CACHE_TTL',
  sunbird_learner_service_local_base_url: 'learner_Service_Local_BaseUrl',
  sunbird_content_service_local_base_url: 'content_Service_Local_BaseUrl',
  sunbird_android_app_url: 'ANDROID_APP_URL',
  sunbird_explore_button_visibility: 'EXPLORE_BUTTON_VISIBILITY',
  sunbird_enable_signup: 'ENABLE_SIGNUP',
  sunbird_build_number: 'BUILD_NUMBER',
  sunbird_telemetry_service_local_url: 'TELEMETRY_SERVICE_LOCAL_URL',
  sunbird_api_response_cache_ttl: 'PORTAL_API_CACHE_TTL',
  sunbird_extcont_whitelisted_domains: 'SUNBIRD_EXTCONT_WHITELISTED_DOMAINS',
  sunbird_tenant_cdn_url: 'TENANT_CDN_URL',
  sunbird_cloud_storage_urls: 'CLOUD_STORAGE_URLS',
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
      let configKeys = _.keys(configMap)
      readConfigs(configKeys).then(function (configObj) {      
        resolve(checkAndStoreConfigs(configObj))
      }, function (err) {
        resolve(checkAndStoreConfigs(configs))
      })
      if (cacheRefreshEnabled == false) {
        scheduleConfigRefreshJob()
      }
    } else {
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
          keys: configKeys
        }
      }
    }
    request(options, function (err, response, body) {
      if (!err && body && body.responseCode === 'OK') {
        resolve(body.result.keys)
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
  return configModel.get(configKey)
}

module.exports = {
  fetchConfig: fetchConfig,
  getConfig: getConfig
}
