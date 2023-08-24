'use strict'
const env = process.env
const fs = require('fs')
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const SB_DOMAIN = 'https://staging.sunbirded.org'

let envVariables = {
  // Environment variables
  APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
  sunbird_instance_name: env.sunbird_instance || 'Sunbird',
  DEFAULT_CHANNEL: env.sunbird_default_channel,
  PORTAL_SESSION_SECRET_KEY: (env.sunbird_portal_session_secret && env.sunbird_portal_session_secret !== '')
    ? env.sunbird_portal_session_secret.split(',') : 'sunbird,ed48b0ce-5a92-11ed-9b6a-0242ac120002'.split(','),
  // discussion forum
  discussions_middleware: env.discussions_middleware || 'http://discussionsmw-service:3002', //todo
  uci_service_base_url: env.uci_service_base_url || "http://kong:8000", //todo

  // Application Start-up - Hosts and PORT Configuration
  PORTAL_PORT: env.sunbird_port || 3000,
  LEARNER_URL: env.sunbird_learner_player_url || SB_DOMAIN + '/api/',
  CONTENT_URL: env.sunbird_content_player_url || SB_DOMAIN + '/api/',
  CONTENT_PROXY_URL: env.sunbird_content_proxy_url || SB_DOMAIN,
  REPORT_SERVICE_URL: env.sunbird_report_service_url || SB_DOMAIN + '/api/data/v1/report-service', //todo
  sunbird_kid_public_key_base_path: env.sunbird_kid_public_key_base_path || '/keys/',
  SUNBIRD_PROTO: env.sunbird_base_proto,

  // Telemetry Configuration
  TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'http://telemetry-service:9001/', //todo

  // BLOB and Storage Configuration
  sunbird_cloud_storage_provider: env.sunbird_cloud_storage_provider || 'azure',
  PORTAL_CASSANDRA_REPLICATION_STRATEGY: env.sunbird_cassandra_replication_strategy || '{"class":"SimpleStrategy","replication_factor":1}',

  // ############# CSP Configuration #############
  // Common key for Uploading Desktop Crash logs
  cloud_storage_desktopCrash_bucketname: env.cloud_storage_desktopCrash_bucketname || 'desktopappcrashlogs', //todo

  //Generalised cloud configuration
  cloud_private_storage_accountname: env.cloud_private_storage_accountname || 'tst',
  cloud_private_storage_secret: env.cloud_private_storage_secret || 'test',

  // Service(s) Base URL(s)
  learner_Service_Local_BaseUrl: env.sunbird_learner_service_local_base_url || 'http://learner-service:9000',
  CONTENT_SERVICE_UPSTREAM_URL: env.sunbird_content_service_upstream_url || 'http://localhost:5000/', //todo
  LEARNER_SERVICE_UPSTREAM_URL: env.sunbird_learner_service_upstream_url || 'http://localhost:9000/', //todo
  DATASERVICE_URL: env.sunbird_dataservice_url || SB_DOMAIN + '/api/', //todo
  PORTAL_EXT_PLUGIN_URL: process.env.sunbird_ext_plugin_url || 'http://player_player:3000/plugin/',
  sunbird_data_product_service: env.sunbird_data_product_service || 'https://staging.ntp.net.in/',

  // Health Checks Configuration // unable to load the portal
  sunbird_portal_health_check_enabled: env.sunbird_health_check_enable || 'true',
  sunbird_learner_service_health_status: 'true',
  sunbird_content_service_health_status: 'true',
  sunbird_portal_cassandra_db_health_status: 'true',

  // CDN Configuration -  host terminated
  TENANT_CDN_URL: env.sunbird_tenant_cdn_url || '',

  // Kong - device registration and refresh token keys
  KONG_DEVICE_REGISTER_TOKEN: env.sunbird_kong_device_register || 'false',
  KONG_DEVICE_REGISTER_ANONYMOUS_TOKEN: env.sunbird_kong_device_register_anonymous || 'false',
  // Kong endpoints
  sunbird_anonymous_device_register_api: env.sunbird_anonymous_device_register_api || '',
  sunbird_kong_refresh_token_api: env.sunbird_kong_refresh_token_api || '',
  KONG_DEVICE_REGISTER_AUTH_TOKEN:
    env.sunbird_kong_device_register_token ||
    "token", sunbird_anonymous_session_ttl: env.sunbird_anonymous_session_ttl ? parseInt(env.sunbird_anonymous_session_ttl) : 10 * 60 * 1000,
  // Device register API for anonymous users
  sunbird_anonymous_register_token:
    env.sunbird_anonymous_register_token ||
    "token",  // Device register API for logged in users
  // Fallback token for device register API for `anonymous` users
  sunbird_anonymous_default_token:
    env.sunbird_anonymous_default_token ||
    "token",  // Fallback token for device register API for `logged` users
}

envVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '')
  ? env.sunbird_cassandra_urls.split(',') : ['localhost']

// Path to dev config file
const devConfig = __dirname + '/devConfig.js';
try {
  // If environment is `local`; use custom config
  // Else default config will be used
  if (process.env.sunbird_environment === 'local' && fs.existsSync(devConfig)) {
    const devVariables = require('./devConfig');
    module.exports = devVariables;
    // console.log('local---->',devVariables);
  } else {
    module.exports = envVariables;
    // console.log('env---->',envVariables);
  }
} catch (error) {
  module.exports = envVariables;
  // console.log('errorEnv---->',envVariables);
}
