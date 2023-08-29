'use strict'
const env = process.env
const fs = require('fs')
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const SB_DOMAIN = 'https://staging.sunbirded.org' // mandatory
let envVariables = {
  // Environment variables
  //mandatory
  KONG_DEVICE_REGISTER_AUTH_TOKEN:
    env.sunbird_kong_device_register_token ||
    "token1",
  // Device register API for anonymous users
  sunbird_anonymous_register_token:
    env.sunbird_anonymous_register_token ||
    "token2",
  // Fallback token for device register API for `anonymous` users
  sunbird_anonymous_default_token:
    env.sunbird_anonymous_default_token ||
    "token3",
  //Generalised cloud configuration // 
  cloud_private_storage_accountname: env.cloud_private_storage_accountname || 'azure', //default 
  sunbird_cloud_storage_provider: env.sunbird_cloud_storage_provider || 'azure',
  cloud_private_storage_secret: env.cloud_private_storage_secret || 'private_storage_secret', //mandatory
  // default value present
  sunbird_anonymous_session_ttl: env.sunbird_anonymous_session_ttl ? parseInt(env.sunbird_anonymous_session_ttl) : 10 * 60 * 1000,
  APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
  sunbird_instance_name: env.sunbird_instance || 'Sunbird',
  DEFAULT_CHANNEL: env.sunbird_default_channel,
  PORTAL_SESSION_SECRET_KEY: (env.sunbird_portal_session_secret && env.sunbird_portal_session_secret !== '')
    ? env.sunbird_portal_session_secret.split(',') : 'sunbird,ed48b0ce-5a92-11ed-9b6a-0242ac120002'.split(','),
  // Application Start-up - Hosts and PORT Configuration
  PORTAL_PORT: env.sunbird_port || 3200,
  LEARNER_URL: env.sunbird_learner_player_url || SB_DOMAIN + '/api/',
  CONTENT_URL: env.sunbird_content_player_url || SB_DOMAIN + '/api/',
  CONTENT_PROXY_URL: env.sunbird_content_proxy_url || SB_DOMAIN,
  sunbird_kid_public_key_base_path: env.sunbird_kid_public_key_base_path || '/keys/',
  SUNBIRD_PROTO: env.sunbird_base_proto,
  // Telemetry Configuration
  TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'http://telemetry-service:9001/',
  // BLOB and Storage Configuration
  PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'in-memory',
  PORTAL_CASSANDRA_REPLICATION_STRATEGY: env.sunbird_cassandra_replication_strategy || '{"class":"SimpleStrategy","replication_factor":1}',
  // ############# CSP Configuration #############
  // Common key for Uploading Desktop Crash logs
  cloud_storage_desktopCrash_bucketname: env.cloud_storage_desktopCrash_bucketname || 'desktopappcrashlogs',
  // Service(s) Base URL(s)
  DATASERVICE_URL: env.sunbird_dataservice_url || SB_DOMAIN + '/api/',
  // Health Checks Configuration
  sunbird_portal_health_check_enabled: env.sunbird_health_check_enable || 'true',
  sunbird_learner_service_health_status: 'true',
  sunbird_content_service_health_status: 'true',
  sunbird_portal_cassandra_db_health_status: 'true',
  // CDN Configuration
  TENANT_CDN_URL: env.sunbird_tenant_cdn_url || '',
  // Kong - device registration and refresh token keys
  KONG_DEVICE_REGISTER_TOKEN: env.sunbird_kong_device_register || 'false',
  KONG_DEVICE_REGISTER_ANONYMOUS_TOKEN: env.sunbird_kong_device_register_anonymous || 'false',
  // Kong endpoints
  sunbird_anonymous_device_register_api: env.sunbird_anonymous_device_register_api || '',
  sunbird_kong_refresh_token_api: env.sunbird_kong_refresh_token_api || '',
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
