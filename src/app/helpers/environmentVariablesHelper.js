// ************** DEV Env... ***************
// 'use strict'
// const env = process.env
// const fs = require('fs')
// const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'))
// let envVariables = {
//   sunbird_kid_public_key_base_path: env.sunbird_kid_public_key_base_path || '/keys/',
//   REPORT_SERVICE_URL: 'https://dev.sunbirded.org/api/data/v1/report-service',
//   LEARNER_URL: env.sunbird_learner_player_url || 'https://dev.sunbirded.org/api/',
//   CONTENT_URL: env.sunbird_content_player_url || 'https://dev.sunbirded.org/api/',
//   CONFIG_URL: env.sunbird_config_service_url || 'https://dev.sunbirded.org/api/config/',
//   CONFIG_REFRESH_INTERVAL: env.config_refresh_interval || 10,
//   CONFIG_SERVICE_ENABLED: env.config_service_enabled || false,
//   CONTENT_PROXY_URL: env.sunbird_content_proxy_url || 'https://dev.sunbirded.org',
//   PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
//   PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || 'https://dev.sunbirded.org/auth',
//   PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',
//   APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
//   DEFAULT_CHANNEL: env.sunbird_default_channel || 'tn',
//   EKSTEP_ENV: env.ekstep_env || 'qa',
//   PORTAL_PORT: env.sunbird_port || 3000,
//   PORTAL_API_AUTH_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyZThlNmU5MjA4YjI0MjJmOWFlM2EzNjdiODVmNWQzNiJ9.gvpNN7zEl28ZVaxXWgFmCL6n65UJfXZikUWOKSE8vJ8',
//   PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 1000,
//   PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || 'https://dev.sunbirded.org/api/echo/',
//   PORTAL_AUTOCREATE_TRAMPOLINE_USER: env.sunbird_autocreate_trampoline_user || 'true',
//   PORTAL_TRAMPOLINE_CLIENT_ID: 'trampoline',
//   PORTAL_TRAMPOLINE_SECRET: '36c4277f-d59b-4ea2-b788-964b96bd47d1',
//   ENABLE_PERMISSION_CHECK: 1 || 0,
//   PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'in-memory',
//   PORTAL_CDN_URL: env.sunbird_portal_cdn_url || '',
//   CONTENT_SERVICE_UPSTREAM_URL: env.sunbird_content_service_upstream_url || 'http://localhost:5000/',
//   LEARNER_SERVICE_UPSTREAM_URL: env.sunbird_learner_service_upstream_url || 'http://localhost:9000/',
//   DATASERVICE_URL: env.sunbird_dataservice_url || 'https://dev.sunbirded.org/api/',
//   KEY_CLOAK_PUBLIC: env.sunbird_keycloak_public || 'true',
//   KEY_CLOAK_REALM: env.sunbird_keycloak_realm || 'sunbird',
//   CACHE_STORE: env.sunbird_cache_store || 'memory',
//   CACHE_TTL: env.sunbird_cache_ttl || 1800,
//   ANDROID_APP_URL: env.sunbird_android_app_url || 'http://www.sunbird.org',
//   BUILD_NUMBER: env.sunbird_build_number || packageObj.version + '.' + packageObj.buildHash,
//   // TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'http://telemetry-service:9001/',
//   TELEMETRY_SERVICE_LOCAL_URL:'https://dev.sunbirded.org' || 'http://telemetry-service:9001/',
//   PORTAL_API_CACHE_TTL: env.sunbird_api_response_cache_ttl || '600',
//   TENANT_CDN_URL: env.sunbird_tenant_cdn_url || '',
//   CLOUD_STORAGE_URLS: env.sunbird_cloud_storage_urls,
//   PORTAL_CASSANDRA_CONSISTENCY_LEVEL: env.sunbird_cassandra_consistency_level || 'one',
//   PORTAL_CASSANDRA_REPLICATION_STRATEGY: env.sunbird_cassandra_replication_strategy || '{"class":"SimpleStrategy","replication_factor":1}',
//   PORTAL_EXT_PLUGIN_URL: process.env.sunbird_ext_plugin_url || 'http://player_player:3000/plugin/',
//   DEVICE_REGISTER_API: process.env.sunbird_device_register_api || 'https://api.open-sunbird.org/v3/device/register/',
//   sunbird_instance_name: env.sunbird_instance || 'Sunbird',
//   sunbird_theme: env.sunbird_theme || 'default',
//   sunbird_default_language: env.sunbird_portal_default_language || 'en',
//   sunbird_primary_bundle_language: env.sunbird_portal_primary_bundle_language || 'en',
//   learner_Service_Local_BaseUrl: env.sunbird_learner_service_local_base_url || 'http://learner-service:9000',
//   content_Service_Local_BaseUrl: env.sunbird_content_service_local_base_url || 'http://content-service:5000',
//   sunbird_explore_button_visibility: env.sunbird_explore_button_visibility || 'true',
//   sunbird_help_link_visibility: env.sunbird_help_link_visibility || 'true',
//   sunbird_extcont_whitelisted_domains: env.sunbird_extcont_whitelisted_domains || 'youtube.com,youtu.be',
//   sunbird_portal_user_upload_ref_link: env.sunbird_portal_user_upload_ref_link || 'http://www.sunbird.org/features-documentation/register_user',
//   GOOGLE_OAUTH_CONFIG: {
//     clientId: env.sunbird_google_oauth_clientId  || '671624305038-e8pbpmidst6lf0j5qplp6g6odan3lbf5.apps.googleusercontent.com' || '903729999899-7vcrph3vro36ot43j1od8u6he9jjend0.apps.googleusercontent.com',
//     clientSecret: env.sunbird_google_oauth_clientSecret || 'mDO2MM68iW23f47ZFtvREld9' || 'BAEAYRv7voTByz5rOKkbIE3u' 
//   },
//   KEYCLOAK_GOOGLE_CLIENT: {
//     clientId: env.sunbird_google_keycloak_client_id || 'google-auth',
//     secret: env.sunbird_google_keycloak_secret || '8486df4b-2ec0-4249-92d8-5f3a7064cd07'
//   },
//   sunbird_google_captcha_site_key: env.sunbird_google_captcha_site_key || '6Ldcf4EUAAAAAMrKQSviNtEzMretoDgeAUxqJv7d',
//   sunbird_azure_report_container_name: env.sunbird_azure_report_container_name || 'reports',
//   sunbird_azure_account_name: env.sunbird_azure_account_name || 'sunbirddev',
//   sunbird_azure_account_key: env.sunbird_azure_account_key || 'XcRoJsGkl8Gq5LpMm9Hnm0AEd3GpCHi7ck1qcdovIcN2VMWIvKiYtOEHHALeIq/5GJ9wrs6DUPszF9mV6tB9Qg==',
//   sunbird_portal_health_check_enabled: env.sunbird_health_check_enable || 'true',
//   sunbird_learner_service_health_status: 'true',
//   sunbird_content_service_health_status: 'true',
//   sunbird_portal_cassandra_db_health_status: 'true',
//   sunbird_portal_player_cdn_enabled: env.sunbird_portal_player_cdn_enabled,
//   sunbird_processing_kafka_host: process.env.sunbird_processing_kafka_host,
//   sunbird_sso_kafka_topic: process.env.sunbird_sso_kafka_topic,
//   sunbird_portal_offline_tenant: env.sunbird_portal_offline_tenant || 'ap,tn',
//   sunbird_portal_offline_supported_languages: env.sunbird_portal_offline_supported_languages,
//   sunbird_portal_offline_app_release_date: env.sunbird_portal_offline_app_release_date,
//   sunbird_portal_offline_app_version: env.sunbird_portal_offline_app_version,
//   sunbird_portal_offline_app_download_url: env.sunbird_portal_offline_app_download_url || 'https://sunbird-ed.github.io/sunbird-style-guide/dist/#/test-page',
//   sunbird_portal_cdn_blob_url: env.sunbird_portal_cdn_blob_url || '',
//   sunbird_portal_log_level: env.sunbird_portal_log_level || 'debug',
//   KEYCLOAK_GOOGLE_ANDROID_CLIENT: {
//     clientId: env.sunbird_google_android_keycloak_client_id,
//     secret: env.sunbird_google_android_keycloak_secret
//   },
//   CONTENT_EDITORS_URL: {
//     COLLECTION_EDITOR: '/thirdparty/editors/collection-editor/index.html',
//     CONTENT_EDITOR: '/thirdparty/editors/content-editor/index.html',
//     GENERIC_EDITOR: '/thirdparty/editors/generic-editor/index.html'
// },
// PHRASE_APP: {
//   phrase_authToken: env.sunbird_phraseApp_token || '',
//   phrase_project: env.phrase_project || 'DIKSHA Portal,Sunbird Creation',
//   phrase_locale: env.phrase_locale || ['en-IN', 'bn-IN', 'hi-IN', 'kn-IN', 'mr-IN', 'ur-IN', 'te-IN', 'ta-IN'],
//   phrase_fileformat: env.phrase_fileformat || 'json'
// },
//   KEYCLOAK_TRAMPOLINE_ANDROID_CLIENT: {
//     clientId: env.sunbird_trampoline_android_keycloak_client_id,
//     secret: env.sunbird_trampoline_android_keycloak_secret
//   },
//   KEYCLOAK_ANDROID_CLIENT: {
//     clientId: env.sunbird_android_keycloak_client_id || 'android',
//   },
//   sunbird_azure_resourceBundle_container_name: env.sunbird_azure_resourceBundle_container_name || 'label'
// }

// envVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '')
//   ? env.sunbird_cassandra_urls.split(',') : ['localhost']
// module.exports = envVariables

// ******************** Staging Env. *********************

'use strict'
const env = process.env
const fs = require('fs')
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'));
let envVariables = {
  sunbird_kid_public_key_base_path: env.sunbird_kid_public_key_base_path || '/keys/',
  REPORT_SERVICE_URL: 'https://dev.sunbirded.org/api/data/v1/report-service',
  reportsListVersion: env.reportsListVersion || 'v1',
  LEARNER_URL: env.sunbird_learner_player_url || 'https://staging.ntp.net.in/api/',
  CONTENT_URL: env.sunbird_content_player_url || 'https://staging.ntp.net.in/api/',
  CONTENT_PROXY_URL: env.sunbird_content_proxy_url || 'https://staging.ntp.net.in',
  PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
  PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || 'https://staging.ntp.net.in/auth',
  PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',
  APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
  DEFAULT_TENANT: 'ntp',
  DEFAULT_CHANNEL: 'ntp',
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
  REPORT_SERVICE_URL: env.sunbird_report_service_url || 'https://staging.open-sunbird.org/api/data/v1/report-service',
  SUNBIRD_PORTAL_BASE_URL: env.sunbird_portal_base_url,
  sunbird_device_api: env.sunbird_device_api || 'https://staging.ntp.net.in/api/',
  sunbird_portal_slugForProminentFilter: env.sunbird_portal_slugForProminentFilter,


  // TTL and Intervals
  CONFIG_REFRESH_INTERVAL: env.config_refresh_interval || 10,
  PORTAL_API_CACHE_TTL: env.sunbird_api_response_cache_ttl || '600',
  CACHE_TTL: env.sunbird_cache_ttl || 1800,
  RESPONSE_CACHE_TTL: env.sunbird_response_cache_ttl || '180', // used in tenant helper to cache the tenant response info
  sunbird_portal_updateLoginTimeEnabled: env.sunbird_portal_updateLoginTimeEnabled || false,


  // Telemetry Configuration
  PORTAL_PORT: env.sunbird_port || 3000,
  PORTAL_MERGE_AUTH_SERVER_URL: 'https://merge.staging.ntp.net.in/auth',
  PORTAL_API_AUTH_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjNDkyM2Y1Mjg1ZmY0NDdjYmYxMzgwNTQyM2ExZTk4YSJ9.hwQiG6OIFoIJ2O9ec6kau09ltJ-5xA5fWi6aM6NoLEU',
  PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 1000,
  PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || 'https://staging.ntp.net.in/api/echo/',
  PORTAL_AUTOCREATE_TRAMPOLINE_USER: env.sunbird_autocreate_trampoline_user || 'true',
  PORTAL_TRAMPOLINE_CLIENT_ID: env.sunbird_trampoline_client_id || 'trampoline',
  PORTAL_TRAMPOLINE_SECRET: env.sunbird_trampoline_secret,
  ENABLE_PERMISSION_CHECK: env.sunbird_enabless_permission_check || 0,
  PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'in-memory',
  PORTAL_TITLE_NAME: env.sunbird_instance || 'Sunbird',
  PORTAL_CDN_URL: env.sunbird_portal_cdn_url || '',
  PORTAL_THEME: env.sunbird_theme || 'default',
  PORTAL_DEFAULT_LANGUAGE: env.sunbird_portal_default_language || 'en',
  PORTAL_PRIMARY_BUNDLE_LANGUAGE: env.sunbird_portal_primary_bundle_language || 'en',
  CONTENT_SERVICE_UPSTREAM_URL: env.sunbird_content_service_upstream_url || 'http://localhost:5000/',
  LEARNER_SERVICE_UPSTREAM_URL: env.sunbird_learner_service_upstream_url || 'http://localhost:9000/',
  DATASERVICE_URL: env.sunbird_dataservice_url || 'https://staging.ntp.net.in/api/',
  KEY_CLOAK_PUBLIC: env.sunbird_keycloak_public || 'true',
  KEY_CLOAK_REALM: env.sunbird_keycloak_realm || 'sunbird',
  CACHE_STORE: env.sunbird_cache_store || 'memory',
  CACHE_TTL: env.sunbird_cache_ttl || 1800,
  learner_Service_Local_BaseUrl: env.sunbird_learner_service_local_base_url || 'http://learner-service:9000',
  content_Service_Local_BaseUrl: env.sunbird_content_service_local_base_url || 'http://content_service_content_service:5000',
  ANDROID_APP_URL: env.sunbird_android_app_url || 'http://www.sunbird.org',
  EXPLORE_BUTTON_VISIBILITY: env.sunbird_explore_button_visibility || 'true',
  ENABLE_SIGNUP: env.sunbird_enable_signup || 'true',
  BUILD_NUMBER: env.sunbird_build_number || packageObj.version+'.'+packageObj.buildHash,
  TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'http://telemetry-service:9001/',
  PORTAL_API_CACHE_TTL: env.sunbird_api_response_cache_ttl || '600',
  SUNBIRD_EXTCONT_WHITELISTED_DOMAINS: env.sunbird_extcont_whitelisted_domains || 'youtube.com,youtu.be',
  TENANT_CDN_URL: env.sunbird_tenant_cdn_url || '',
  PORTAL_EXT_PLUGIN_URL:'https://dev.open-sunbird.org/action/',
  CLOUD_STORAGE_URLS: env.sunbird_cloud_storage_urls,
  PORTAL_USER_UPLOAD_REF_LINK: env.sunbird_portal_user_upload_ref_link || 'http://www.sunbird.org/features-documentation/register_user',
  GOOGLE_OAUTH_CONFIG: {
    clientId: env.sunbird_google_oauth_clientId,
    clientSecret: env.sunbird_google_oauth_clientSecret
  },
  KEYCLOAK_GOOGLE_CLIENT: {
    clientId: env.sunbird_google_keycloak_client_id,
    secret: env.sunbird_google_keycloak_secret
  },
CONTENT_EDITORS_CDN_URL: {
  COLLECTION_EDITOR: env.sunbird_collectionEditorCDN || '',
  CONTENT_EDITOR: env.sunbird_contentEditorCDN || '',
  GENERIC_EDITOR: env.sunbird_genericEditorCDN || ''
},
  sunbird_google_captcha_site_key: env.sunbird_google_captcha_site_key,
  sunbird_azure_account_name: env.sunbird_azure_account_name || 'sunbirddev',
  sunbird_azure_account_key: env.sunbird_azure_account_key || 'hVZeCECRUwsIZEL2h+GqF3bRo5Iz365G+zhrOZlYYYXBmrjuv4NyBv47xsmcvyQvAQPnnLG9r9iGil9TLgeyeA==',
  sunbird_portal_health_check_enabled: env.sunbird_health_check_enable || 'true',
  sunbird_learner_service_health_status: 'true',
  sunbird_content_service_health_status: 'true',
  sunbird_portal_cassandra_db_health_status: 'true',
  sunbird_portal_preview_cdn_url: env.sunbird_portal_preview_cdn_url,
  sunbird_processing_kafka_host: process.env.sunbird_processing_kafka_host,
  sunbird_sso_kafka_topic: process.env.sunbird_sso_kafka_topic,
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
  sunbird_sso_kafka_topic: process.env.sunbird_sso_kafka_topic,
  sunbird_portal_cdn_blob_url: env.sunbird_portal_cdn_blob_url || '',
  sunbird_portal_log_level: env.sunbird_portal_log_level || 'debug',
  DEVICE_REGISTER_API: process.env.sunbird_device_register_api || 'https://api.dev.sunbirded.org/v3/device/register/',
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
  CONTENT_EDITORS_URL: {
        COLLECTION_EDITOR: '/thirdparty/editors/collection-editor/index.html',
        CONTENT_EDITOR: '/thirdparty/editors/content-editor/index.html',
        GENERIC_EDITOR: '/thirdparty/editors/generic-editor/index.html'
    },
    PHRASE_APP: {
        phrase_authToken: env.sunbird_phraseApp_token || '',
        phrase_project: env.phrase_project || 'DIKSHA Portal,Sunbird Creation',
        phrase_locale: env.phrase_locale || ['en-IN', 'bn-IN', 'hi-IN', 'kn-IN', 'mr-IN', 'ur-IN', 'te-IN', 'ta-IN'],
        phrase_fileformat: env.phrase_fileformat || 'json'
      },
sunbird_azure_resourceBundle_container_name: env.sunbird_azure_resourceBundle_container_name || 'label'
}
envVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '')
  ? env.sunbird_cassandra_urls.split(',') : ['localhost']
module.exports = envVariables


/****************************PRE-PROD ENV************************************ */

// 'use strict'
// const env = process.env
// const fs = require('fs')
// const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'));
// let envVariables = {
//   LEARNER_URL: env.sunbird_learner_player_url || 'https://preprod.ntp.net.in/api/',
//   CONTENT_URL: env.sunbird_content_player_url || 'https://preprod.ntp.net.in/api/',
//   CONTENT_PROXY_URL: env.sunbird_content_proxy_url || 'https://preprod.ntp.net.in',
//   PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
//   PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || 'https://preprod.ntp.net.in/auth',
//   PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',
//   APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
//   DEFAULT_TENANT: 'ntp',
//   DEFAULT_CHANNEL: 'ntp',
//   EKSTEP_ENV: env.ekstep_env || 'qa',
//   PORTAL_PORT: env.sunbird_port || 3000,
//   sunbird_bot_configured: 'true',
//   sunbird_bot_service_URL: 'https://dev.sunbirded.org/chatapi/bot',
//   PORTAL_MERGE_AUTH_SERVER_URL: 'https://merge.preprod.ntp.net.in/auth',
//   PORTAL_API_AUTH_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiYWIwZTIyMmZiNTA0NGU5YTNmZWJhYTM3YWRjYjI3MSJ9.NOUsCaYUd16dR_RR6_SDiN5TqRB0QL8Zr4x4DQsmZXk',
//   PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 1000,
//   PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || 'https://preprod.ntp.net.in/api/echo/',
//   PORTAL_AUTOCREATE_TRAMPOLINE_USER: env.sunbird_autocreate_trampoline_user || 'true',
//   PORTAL_TRAMPOLINE_CLIENT_ID: env.sunbird_trampoline_client_id || 'trampoline',
//   PORTAL_TRAMPOLINE_SECRET: env.sunbird_trampoline_secret,
//   ENABLE_PERMISSION_CHECK: env.sunbird_enabless_permission_check || 0,
//   PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'in-memory',
//   PORTAL_TITLE_NAME: env.sunbird_instance || 'Sunbird',
//   PORTAL_CDN_URL: env.sunbird_portal_cdn_url || '',
//   PORTAL_THEME: env.sunbird_theme || 'default',
//   PORTAL_DEFAULT_LANGUAGE: env.sunbird_portal_default_language || 'en',
//   PORTAL_PRIMARY_BUNDLE_LANGUAGE: env.sunbird_portal_primary_bundle_language || 'en',
//   CONTENT_SERVICE_UPSTREAM_URL: env.sunbird_content_service_upstream_url || 'http://localhost:5000/',
//   LEARNER_SERVICE_UPSTREAM_URL: env.sunbird_learner_service_upstream_url || 'http://localhost:9000/',
//   DATASERVICE_URL: env.sunbird_dataservice_url || 'https://preprod.ntp.net.in/api/',
//   KEY_CLOAK_PUBLIC: env.sunbird_keycloak_public || 'true',
//   KEY_CLOAK_REALM: env.sunbird_keycloak_realm || 'sunbird',
//   CACHE_STORE: env.sunbird_cache_store || 'memory',
//   REPORT_SERVICE_URL: env.sunbird_report_service_url || 'https://staging.open-sunbird.org/api/data/v1/report-service',
//   CACHE_TTL: env.sunbird_cache_ttl || 1800,
//   learner_Service_Local_BaseUrl: env.sunbird_learner_service_local_base_url || 'http://learner-service:9000',
//   content_Service_Local_BaseUrl: env.sunbird_content_service_local_base_url || 'http://content_service_content_service:5000',
//   ANDROID_APP_URL: env.sunbird_android_app_url || 'http://www.sunbird.org',
//   EXPLORE_BUTTON_VISIBILITY: env.sunbird_explore_button_visibility || 'true',
//   ENABLE_SIGNUP: env.sunbird_enable_signup || 'true',
//   BUILD_NUMBER: env.sunbird_build_number || packageObj.version+'.'+packageObj.buildHash,
//   // TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'http://telemetry-service:9001/',
//   TELEMETRY_SERVICE_LOCAL_URL: 'https://dev.sunbirded.org' || 'http://telemetry-service:9001/',
//   PORTAL_API_CACHE_TTL: env.sunbird_api_response_cache_ttl || '600',
//   SUNBIRD_EXTCONT_WHITELISTED_DOMAINS: env.sunbird_extcont_whitelisted_domains || 'youtube.com,youtu.be',
//   TENANT_CDN_URL: env.sunbird_tenant_cdn_url || '',
//   PORTAL_EXT_PLUGIN_URL:'https://dev.open-sunbird.org/action/',
//   CLOUD_STORAGE_URLS: env.sunbird_cloud_storage_urls,
//   PORTAL_USER_UPLOAD_REF_LINK: env.sunbird_portal_user_upload_ref_link || 'http://www.sunbird.org/features-documentation/register_user',
//   GOOGLE_OAUTH_CONFIG: {
//     clientId: env.sunbird_google_oauth_clientId,
//     clientSecret: env.sunbird_google_oauth_clientSecret
//   },
//   KEYCLOAK_GOOGLE_CLIENT: {
//     clientId: env.sunbird_google_keycloak_client_id,
//     secret: env.sunbird_google_keycloak_secret
//   },
//   sunbird_google_captcha_site_key: '6Ldk3O8UAAAAAC2tm0qkPGbJC7YJVpVzMeIuhumb',
//   google_captcha_private_key: '6Ldk3O8UAAAAADomyNFfGHh-bGf0_z6FzaHR4N35',
//   sunbird_azure_report_container_name: env.sunbird_azure_report_container_name || 'reports',
//   sunbird_azure_account_name: env.sunbird_azure_account_name || 'sunbirddev',
//   sunbird_azure_account_key: env.sunbird_azure_account_key || 'hVZeCECRUwsIZEL2h+GqF3bRo5Iz365G+zhrOZlYYYXBmrjuv4NyBv47xsmcvyQvAQPnnLG9r9iGil9TLgeyeA==',
//   sunbird_portal_health_check_enabled: env.sunbird_health_check_enable || 'true',
//   sunbird_learner_service_health_status: 'true',
//   sunbird_content_service_health_status: 'true',
//   sunbird_portal_cassandra_db_health_status: 'true',
//   sunbird_portal_preview_cdn_url: env.sunbird_portal_preview_cdn_url,
//   sunbird_processing_kafka_host: process.env.sunbird_processing_kafka_host,
//   sunbird_sso_kafka_topic: process.env.sunbird_sso_kafka_topic,
//   sunbird_portal_offline_tenant: env.sunbird_portal_offline_tenant,
//   sunbird_portal_offline_supported_languages: env.sunbird_portal_offline_supported_languages,
//   sunbird_portal_offline_app_release_date: env.sunbird_portal_offline_app_release_date,
//   sunbird_portal_offline_app_version: env.sunbird_portal_offline_app_version,
//   sunbird_portal_offline_app_download_url: env.sunbird_portal_offline_app_download_url,
//   sunbird_portal_cdn_blob_url: env.sunbird_portal_cdn_blob_url || '',
//   sunbird_portal_log_level: env.sunbird_portal_log_level || 'debug',
//   DEVICE_REGISTER_API: process.env.sunbird_device_register_api || 'https://api.dev.sunbirded.org/v3/device/register/',
// sunbird_kid_public_key_base_path: env.sunbird_kid_public_key_base_path || '/keys/',
//   KEYCLOAK_GOOGLE_ANDROID_CLIENT: {
//     clientId: env.sunbird_google_android_keycloak_client_id,
//     secret: env.sunbird_google_android_keycloak_secret
//   },
//   KEYCLOAK_TRAMPOLINE_ANDROID_CLIENT: {
//     clientId: env.sunbird_trampoline_android_keycloak_client_id,
//     secret: env.sunbird_trampoline_android_keycloak_secret
//   },
//   KEYCLOAK_ANDROID_CLIENT: {
//     clientId: env.sunbird_android_keycloak_client_id || 'android',
//   },
//   CONTENT_EDITORS_URL: {
//     COLLECTION_EDITOR: env.sunbird_collectionEditorURL || 'collection-editor/index.html',
//     CONTENT_EDITOR: env.sunbird_contentEditorURL || 'content-editor/index.html',
//     GENERIC_EDITOR: env.sunbird_genericEditorURL || 'generic-editor/index.html'
//   }
// }
// envVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '')
//   ? env.sunbird_cassandra_urls.split(',') : ['localhost']

// module.exports = envVariables