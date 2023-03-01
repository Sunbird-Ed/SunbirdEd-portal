'use strict'
const env = process.env
const fs = require('fs')
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'))

// const __envIn = 'dev';
const __envIn = "staging";
const SB_DOMAIN = 'https://staging.sunbirded.org'

let envVariables = {
  APPID: 'local.sunbird.portal',
  sunbird_instance_name: 'Sunbird',
  PORTAL_API_WHITELIST_CHECK: 'false',
  PORTAL_SESSION_SECRET_KEY: ["sunbird", "ed48b0ce-5a92-11ed-9b6a-0242ac120002"],
  PORTAL_PORT: 3000,
  PORTAL_SESSION_STORE_TYPE: 'in-memory',
  PORTAL_CASSANDRA_CONSISTENCY_LEVEL: 'one',
  DEFAULT_TENANT: 'sunbird',
  DEFAULT_CHANNEL: 'ntp',
  sunbird_default_language: 'en',
  TENANT_CDN_URL: '',
  CONTENT_EDITORS_URL: {
    COLLECTION_EDITOR: '',
    CONTENT_EDITOR: '',
    GENERIC_EDITOR: ''
  },
  sunbird_cloud_storage_provider: 'azure',
  PORTAL_CASSANDRA_REPLICATION_STRATEGY: '{"class":"SimpleStrategy","replication_factor":1}',

  //KONG 
  KONG_DEVICE_REGISTER_ANONYMOUS_TOKEN: "true",
  KONG_DEVICE_REGISTER_TOKEN: 'false',
  sunbird_kong_refresh_token_api: 'https://staging.sunbirded.org/auth/v1/refresh/token',
  sunbird_anonymous_device_register_api: "https://staging.sunbirded.org/api/api-manager/v2/consumer/portal_anonymous/credential/register",

  // Azure
  sunbird_azure_account_name: 'sunbirdstagingprivate',
  sunbird_azure_account_key: 'test',
  sunbird_azure_report_container_name: 'reports',
  sunbird_azure_resourceBundle_container_name: 'label',

  //Keycloak 
  KEYCLOAK_GOOGLE_ANDROID_CLIENT: {
    clientId: 'clientId',
    secret: 'secret'
  },
  KEYCLOAK_GOOGLE_IOS_CLIENT: {
    clientId: 'clientId',
    secret: 'secret'
  },
  KEYCLOAK_GOOGLE_DESKTOP_CLIENT: {
    clientId: 'clientId',
    secret: 'secret'
  },
  KEYCLOAK_TRAMPOLINE_ANDROID_CLIENT: {
    clientId: 'clientId',
    secret: 'secret'
  },
  KEYCLOAK_TRAMPOLINE_DESKTOP_CLIENT: {
    clientId: 'clientId',
    secret: 'secret'
  },
  KEYCLOAK_ANDROID_CLIENT: {
    clientId: 'android',
  },
  KEYCLOAK_GOOGLE_CLIENT: {
    clientId: "google-auth",
    secret: "2bbdd3e0-dfd1-4b88-ab6a-8f1a0c659ab0",
  },
  //Urls
  PORTAL_REALM: 'sunbird',
  PORTAL_AUTH_SERVER_URL: SB_DOMAIN + '/auth',
  PORTAL_AUTH_SERVER_CLIENT: 'portal',
  REPORT_SERVICE_URL: SB_DOMAIN + '/api/data/v1/report-service',
  CONTENT_URL: SB_DOMAIN + '/api/',
  DATASERVICE_URL: SB_DOMAIN + '/api/',
  discussions_middleware: 'http://discussionsmw-service:3002',
  uci_service_base_url: "http://kong:8000",
  LEARNER_URL: SB_DOMAIN + '/api/',
  learner_Service_Local_BaseUrl: 'http://learner-service:9000',
  TELEMETRY_SERVICE_LOCAL_URL: 'http://telemetry-service:9001/',
  CONTENT_PROXY_URL: SB_DOMAIN,
  PORTAL_EXT_PLUGIN_URL: 'http://player_player:3000/plugin/',
  CONTENT_SERVICE_UPSTREAM_URL: 'http://localhost:5000/',
  LEARNER_SERVICE_UPSTREAM_URL: 'http://localhost:9000/',
  content_Service_Local_BaseUrl: "http://content_service_content_service:5000",
  sunbird_device_api: SB_DOMAIN + '/api/',
  sunbird_kid_public_key_base_path: '/keys/',
  sunbird_data_product_service: SB_DOMAIN,

  // logged in user configs
  sunbird_loggedin_device_register_api: 'https://staging.sunbirded.org/api/api-manager/v2/consumer/portal_loggedin/credential/register',

  //TTL
  sunbird_anonymous_session_ttl: 10 * 60 * 1000,
  sunbird_session_ttl:24 * 60 * 60 * 1000,
​
  //Cache config
  CACHE_STORE:  "memory",
  CACHE_TTL: 1800,
​
  //Healthcheck flags
  sunbird_portal_health_check_enabled: "true",
  sunbird_learner_service_health_status: "true",
  sunbird_content_service_health_status: "true",
  sunbird_portal_cassandra_db_health_status: "true",

  // Keys
  KONG_DEVICE_REGISTER_AUTH_TOKEN: env.sunbird_kong_device_register_token,
  sunbird_anonymous_default_token: env.sunbird_anonymous_default_token,
  sunbird_anonymous_register_token: env.sunbird_anonymous_register_token,
  sunbird_loggedin_register_token: env.sunbird_loggedin_register_token,
  sunbird_logged_default_token: env.sunbird_logged_default_token,
  PORTAL_API_AUTH_TOKEN: env.sunbird_api_auth_token,

}
envVariables.PORTAL_CASSANDRA_URLS = ["localhost:9042"];

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
