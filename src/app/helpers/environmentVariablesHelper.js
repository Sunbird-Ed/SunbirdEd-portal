'use strict'
const env = process.env
const fs = require('fs')
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'))

let envVariables = {

  // Environment variables
  APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
  sunbird_instance_name: env.sunbird_instance || 'Sunbird',
  DEFAULT_CHANNEL: env.sunbird_default_channel,


  // Application Start-up - Hosts and PORT Configuration
  PORTAL_PORT: env.sunbird_port || 3000,
  LEARNER_URL: env.sunbird_learner_player_url || 'https://staging.open-sunbird.org/api/',
  CONTENT_URL: env.sunbird_content_player_url || 'https://staging.open-sunbird.org/api/',
  CONTENT_PROXY_URL: env.sunbird_content_proxy_url || 'https://staging.open-sunbird.org',
  PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
  PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || 'https://staging.open-sunbird.org/auth',
  PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',
  PORTAL_API_AUTH_TOKEN: env.sunbird_api_auth_token,
  PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || 'https://staging.open-sunbird.org/api/echo/',
  CONFIG_URL: env.sunbird_config_service_url || 'https://staging.open-sunbird.org/api/config/',
  EKSTEP_ENV: env.ekstep_env || 'qa',
  DEVICE_REGISTER_API: process.env.sunbird_device_register_api || 'https://api.open-sunbird.org/v3/device/register/',
  DEVICE_PROFILE_API: process.env.sunbird_device_profile_api || 'https://staging.open-sunbird.org/api/v3/device/profile/',
  sunbird_theme: env.sunbird_theme || 'default',
  BUILD_NUMBER: packageObj.version + '.' + packageObj.buildHash,
  sunbird_portal_log_level: env.sunbird_portal_log_level || 'debug',
  sunbird_extcont_whitelisted_domains: env.sunbird_extcont_whitelisted_domains || 'youtube.com,youtu.be',
  sunbird_explore_button_visibility: env.sunbird_explore_button_visibility || 'true',
  sunbird_help_link_visibility: env.sunbird_help_link_visibility || 'false',
  sunbird_portal_user_upload_ref_link: env.sunbird_portal_user_upload_ref_link || 'http://www.sunbird.org/features-documentation/register_user',
  ENABLE_PERMISSION_CHECK: env.sunbird_enabless_permission_check || 0,
  CONFIG_SERVICE_ENABLED: env.config_service_enabled || false,
  CRYPTO_ENCRYPTION_KEY: env.crypto_encryption_key || '030702bc8696b8ee2aa71b9f13e4251e',
  LOG_FINGERPRINT_DETAILS: env.sunbird_log_fingerprint_details || 'true',
  SUNBIRD_PORTAL_BASE_URL: env.sunbird_portal_base_url,
  sunbird_device_api: env.sunbird_device_api || 'https://staging.ntp.net.in/api/',


  // TTL and Intervals
  CONFIG_REFRESH_INTERVAL: env.config_refresh_interval || 10,
  PORTAL_API_CACHE_TTL: env.sunbird_api_response_cache_ttl || '600',
  CACHE_TTL: env.sunbird_cache_ttl || 1800,
  RESPONSE_CACHE_TTL: env.sunbird_response_cache_ttl || '180', // used in tenant helper to cache the tenant response info
  sunbird_portal_updateLoginTimeEnabled:env.sunbird_portal_updateLoginTimeEnabled || false,


  // Telemetry Configuration
  PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 1000,
  TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'http://telemetry-service:9001/',


  // Keycloak Configuration
  KEY_CLOAK_PUBLIC: env.sunbird_keycloak_public || 'true',
  KEY_CLOAK_REALM: env.sunbird_keycloak_realm || 'sunbird',
  KEYCLOAK_GOOGLE_CLIENT: {
    clientId: env.sunbird_google_keycloak_client_id,
    secret: env.sunbird_google_keycloak_secret
  },
  KEYCLOAK_GOOGLE_ANDROID_CLIENT: {
    clientId: env.sunbird_google_android_keycloak_client_id,
    secret: env.sunbird_google_android_keycloak_secret
  },
  KEYCLOAK_TRAMPOLINE_ANDROID_CLIENT: {
    clientId: env.sunbird_trampoline_android_keycloak_client_id,
    secret: env.sunbird_trampoline_android_keycloak_secret
  },
  KEYCLOAK_ANDROID_CLIENT: {
    clientId: env.sunbird_android_keycloak_client_id || 'android',
  },
  PORTAL_TRAMPOLINE_CLIENT_ID: env.sunbird_trampoline_client_id || 'trampoline',
  PORTAL_TRAMPOLINE_SECRET: env.sunbird_trampoline_secret,
  PORTAL_AUTOCREATE_TRAMPOLINE_USER: env.sunbird_autocreate_trampoline_user || 'true',
  PORTAL_MERGE_AUTH_SERVER_URL: env.sunbird_portal_merge_auth_server_url || 'https://merge.staging.open-sunbird.org/auth',


  // Social login Configuration
  GOOGLE_OAUTH_CONFIG: {
    clientId: env.sunbird_google_oauth_clientId,
    clientSecret: env.sunbird_google_oauth_clientSecret
  },
  sunbird_google_captcha_site_key: env.sunbird_google_captcha_site_key,


  // Android Configuration
  ANDROID_APP_URL: env.sunbird_android_app_url || 'http://www.sunbird.org',


  // BLOB and Storage Configuration
  CACHE_STORE: env.sunbird_cache_store || 'memory',
  PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'in-memory',
  CLOUD_STORAGE_URLS: env.sunbird_cloud_storage_urls,
  PORTAL_CASSANDRA_CONSISTENCY_LEVEL: env.sunbird_cassandra_consistency_level || 'one',
  PORTAL_CASSANDRA_REPLICATION_STRATEGY: env.sunbird_cassandra_replication_strategy || '{"class":"SimpleStrategy","replication_factor":1}',
  sunbird_azure_report_container_name: env.sunbird_azure_report_container_name || 'reports',
  sunbird_azure_account_name: env.sunbird_azure_account_name,
  sunbird_azure_account_key: env.sunbird_azure_account_key,
  sunbird_portal_cdn_blob_url: env.sunbird_portal_cdn_blob_url || '',
  sunbird_portal_video_max_size: env.sunbird_portal_video_max_size || '50',


  // Default Language Configuration
  sunbird_default_language: env.sunbird_portal_default_language || 'en',
  sunbird_primary_bundle_language: env.sunbird_portal_primary_bundle_language || 'en',


  // Service(s) Base URL(s)
  learner_Service_Local_BaseUrl: env.sunbird_learner_service_local_base_url || 'http://learner-service:9000',
  content_Service_Local_BaseUrl: env.sunbird_content_service_local_base_url || 'http://content-service:5000',
  CONTENT_SERVICE_UPSTREAM_URL: env.sunbird_content_service_upstream_url || 'http://localhost:5000/',
  LEARNER_SERVICE_UPSTREAM_URL: env.sunbird_learner_service_upstream_url || 'http://localhost:9000/',
  DATASERVICE_URL: env.sunbird_dataservice_url || 'https://staging.open-sunbird.org/api/',
  PORTAL_EXT_PLUGIN_URL: process.env.sunbird_ext_plugin_url || 'http://player_player:3000/plugin/',


  // Health Checks Configuration
  sunbird_portal_health_check_enabled: env.sunbird_health_check_enable || 'true',
  sunbird_learner_service_health_status: 'true',
  sunbird_content_service_health_status: 'true',
  sunbird_portal_cassandra_db_health_status: 'true',


  // Desktop App Configuration
  sunbird_portal_offline_tenant: env.sunbird_portal_offline_tenant,
  sunbird_portal_offline_supported_languages: env.sunbird_portal_offline_supported_languages,
  sunbird_portal_offline_app_release_date: env.sunbird_portal_offline_app_release_date,
  sunbird_portal_offline_app_version: env.sunbird_portal_offline_app_version,
  sunbird_portal_offline_app_download_url: env.sunbird_portal_offline_app_download_url,
  DESKTOP_APP_STORAGE_URL: env.desktop_app_storage_url,
 

  // CDN Configuration
  PORTAL_CDN_URL: env.sunbird_portal_cdn_url || '',
  TENANT_CDN_URL: env.sunbird_tenant_cdn_url || '',
  sunbird_portal_preview_cdn_url: env.sunbird_portal_preview_cdn_url,


  // Kafka Configuration
  sunbird_processing_kafka_host: process.env.sunbird_processing_kafka_host,
  sunbird_sso_kafka_topic: process.env.sunbird_sso_kafka_topic
}

envVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '')
  ? env.sunbird_cassandra_urls.split(',') : ['localhost']

module.exports = envVariables

