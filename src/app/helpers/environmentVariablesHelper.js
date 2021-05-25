'use strict'
const env = process.env
const fs = require('fs')
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const __envIn = 'dev';
// const __envIn = 'staging';
// const __envIn = 'preprod';
// const __envIn = 'loadtest';
/**
 * *****************************************************************
 */
//
// Dev Server
//
let devEnvVariables = {
  discussion_forum_token: env.discussion_forum_token || 'a4838b88-6a04-4293-a504-245862cad404',
  discussions_middleware: env.discussions_middleware || 'http://disussionsmw-service:3002/discussion',
  TRACE_ID_ENABLED: env.isTraceEnabled || true,
  KEYCLOAK_GOOGLE_DESKTOP_CLIENT: {
    clientId: env.sunbird_google_desktop_keycloak_client_id || 'zz',
    secret: env.sunbird_google_desktop_keycloak_secret || 'zz'
  },
  KEYCLOAK_TRAMPOLINE_DESKTOP_CLIENT: {
    clientId: env.sunbird_trampoline_desktop_keycloak_client_id,
    secret: env.sunbird_trampoline_desktop_keycloak_secret
  },
  KEYCLOAK_DESKTOP_CLIENT: {
    clientId: env.sunbird_desktop_keycloak_client_id || 'desktop',
  },
  // sunbird_session_ttl: parseInt(120000), // 2 minutes
  // sunbird_session_ttl: parseInt(600000), // 10 minutes
  sunbird_session_ttl: env.sunbird_session_ttl ? parseInt(env.sunbird_session_ttl) : 24 * 60 * 60 * 1000,
  sunbird_anonymous_session_ttl: env.sunbird_anonymous_session_ttl ? parseInt(env.sunbird_anonymous_session_ttl) : 10 * 60 * 1000,
  sunbird_device_api: 'https://sunbird.stackroutelabs.com/api/',
  sunbird_portal_base_url: 'https://sunbird.stackroutelabs.com',
  SUNBIRD_PORTAL_BASE_URL: 'https://sunbird.stackroutelabs.com',
  sunbird_data_product_service: env.sunbird_data_product_service || 'https://sunbird.stackroutelabs.com/',
  LEARNER_URL: env.sunbird_learner_player_url || 'https://sunbird.stackroutelabs.com/api/',
  CONTENT_URL: env.sunbird_content_player_url || 'https://sunbird.stackroutelabs.com/api/',
  CONFIG_URL: env.sunbird_config_service_url || 'https://sunbird.stackroutelabs.com/api/config/',
  CONFIG_REFRESH_INTERVAL: env.config_refresh_interval || 10,
  CONFIG_SERVICE_ENABLED: env.config_service_enabled || false,
  CONTENT_PROXY_URL: env.sunbird_content_proxy_url || 'https://sunbird.stackroutelabs.com/',
  PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
  PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || 'https://sunbird.stackroutelabs.com/auth',
  PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',
  APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
  DEFAULT_CHANNEL: env.sunbird_default_channel || 'tn',
  EKSTEP_ENV: env.ekstep_env || 'qa',
  PORTAL_PORT: env.sunbird_port || 3000,
  PORTAL_API_AUTH_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2eDFyQjhsdjNRQXZ4NmpJY1h6VkxQMmU3d0djUlZhUyJ9.eTDqiChU8Sp5h1pUiv0eSp36rr5FNNQurBD6OT4E0v0',
  PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 1000,
  PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || 'https://sunbird.stackroutelabs.com/api/echo/',
  PORTAL_AUTOCREATE_TRAMPOLINE_USER: env.sunbird_autocreate_trampoline_user || 'true',
  PORTAL_TRAMPOLINE_CLIENT_ID: env.sunbird_trampoline_client_id || 'trampoline',
  PORTAL_TRAMPOLINE_SECRET: env.sunbird_trampoline_secret,
  ENABLE_PERMISSION_CHECK: env.sunbird_enabless_permission_check || 0,
  PORTAL_CDN_URL: env.sunbird_portal_cdn_url || '',
  CONTENT_SERVICE_UPSTREAM_URL: env.sunbird_content_service_upstream_url || 'http://localhost:5000/',
  LEARNER_SERVICE_UPSTREAM_URL: env.sunbird_learner_service_upstream_url || 'http://localhost:9000/',
  DATASERVICE_URL: env.sunbird_dataservice_url || 'https://sunbird.stackroutelabs.com/api/',
  KEY_CLOAK_PUBLIC: env.sunbird_keycloak_public || 'true',
  KEY_CLOAK_REALM: env.sunbird_keycloak_realm || 'sunbird',
  CACHE_STORE: env.sunbird_cache_store || 'memory',
  CACHE_TTL: env.sunbird_cache_ttl || 1800,
  ANDROID_APP_URL: env.sunbird_android_app_url || 'http://www.sunbird.org',
  BUILD_NUMBER: env.sunbird_build_number || packageObj.version + '.' + packageObj.buildHash,
  TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'https://sunbird.stackroutelabs.com/',
  PORTAL_API_CACHE_TTL: env.sunbird_api_response_cache_ttl || '600',
  TENANT_CDN_URL: env.sunbird_tenant_cdn_url || '',
  CLOUD_STORAGE_URLS: env.sunbird_cloud_storage_urls,
  PORTAL_CASSANDRA_CONSISTENCY_LEVEL: env.sunbird_cassandra_consistency_level || 'one',
  PORTAL_CASSANDRA_REPLICATION_STRATEGY: env.sunbird_cassandra_replication_strategy || '{"class":"SimpleStrategy","replication_factor":1}',
  PORTAL_EXT_PLUGIN_URL: process.env.sunbird_ext_plugin_url || 'http://player_player:3000/plugin/',
  DEVICE_REGISTER_API: process.env.sunbird_device_register_api || 'https://api.open-sunbird.org/v3/device/register/',
  sunbird_instance_name: env.sunbird_instance || 'Sunbird',
  sunbird_theme: env.sunbird_theme || 'default',
  sunbird_default_language: env.sunbird_portal_default_language || 'en',
  sunbird_primary_bundle_language: env.sunbird_portal_primary_bundle_language || 'en',
  learner_Service_Local_BaseUrl: env.sunbird_learner_service_local_base_url || 'http://learner-service:9000',
  content_Service_Local_BaseUrl: env.sunbird_content_service_local_base_url || 'http://content-service:5000',
  sunbird_explore_button_visibility: env.sunbird_explore_button_visibility || 'true',
  sunbird_help_link_visibility: env.sunbird_help_link_visibility || 'true',
  sunbird_extcont_whitelisted_domains: env.sunbird_extcont_whitelisted_domains || 'youtube.com,youtu.be',
  sunbird_portal_user_upload_ref_link: env.sunbird_portal_user_upload_ref_link || 'http://www.sunbird.org/features-documentation/register_user',
  GOOGLE_OAUTH_CONFIG: {
    clientId: env.sunbird_google_oauth_clientId || '671624305038-e8pbpmidst6lf0j5qplp6g6odan3lbf5.apps.googleusercontent.com' || '903729999899-7vcrph3vro36ot43j1od8u6he9jjend0.apps.googleusercontent.com',
    clientSecret: env.sunbird_google_oauth_clientSecret || 'mDO2MM68iW23f47ZFtvREld9' || 'BAEAYRv7voTByz5rOKkbIE3u'
  },
  KEYCLOAK_GOOGLE_CLIENT: {
    clientId: env.sunbird_google_keycloak_client_id || 'google-auth',
    secret: env.sunbird_google_keycloak_secret || '8486df4b-2ec0-4249-92d8-5f3a7064cd07'
  },
  sunbird_google_captcha_site_key: env.sunbird_google_captcha_site_key || '6LdXcqgZAAAAAE4NP44m63LDkxbCwTbjDvCHLKCC',
  google_captcha_private_key: '6LdXcqgZAAAAANjDFBMF_e5KaxR8FZ7ywjkNEkgm',
  sunbird_p1_reCaptcha_enabled: false,
  sunbird_p2_reCaptcha_enabled: false,
  sunbird_p3_reCaptcha_enabled: false,
  // sunbird_azure_report_container_name: 'reports',
  // sunbird_azure_account_name: env.sunbird_azure_account_name || 'sunbirddev',
  // sunbird_azure_account_key: env.sunbird_azure_account_key || 'hVZeCECRUwsIZEL2h+GqF3bRo5Iz365G+zhrOZlYYYXBmrjuv4NyBv47xsmcvyQvAQPnnLG9r9iGil9TLgeyeA==',
  sunbird_azure_report_container_name: env.sunbird_azure_report_container_name || 'reports',
  sunbird_azure_account_name: env.sunbird_azure_account_name || 'sunbird1dev1private',
  sunbird_azure_account_key: env.sunbird_azure_account_key || 'unkD02q91kOBvr2uVR9ffw9EFdvtrVK2qNqYzrWFb2etRL3ztQxwevMO6IAr+LOj8u7c9p0F+PK4CpKeiBy0nA==',
  sunbird_portal_health_check_enabled: env.sunbird_health_check_enable || 'true',
  sunbird_learner_service_health_status: 'true',
  sunbird_content_service_health_status: 'true',
  sunbird_portal_cassandra_db_health_status: 'true',
  sunbird_portal_player_cdn_enabled: env.sunbird_portal_player_cdn_enabled,
  sunbird_processing_kafka_host: process.env.sunbird_processing_kafka_host,
  sunbird_sso_kafka_topic: process.env.sunbird_sso_kafka_topic,
  sunbird_portal_offline_tenant: env.sunbird_portal_offline_tenant || 'ap,tn',
  sunbird_portal_offline_supported_languages: env.sunbird_portal_offline_supported_languages,
  sunbird_portal_offline_app_release_date: env.sunbird_portal_offline_app_release_date,
  sunbird_portal_offline_app_version: env.sunbird_portal_offline_app_version,
  sunbird_portal_offline_app_download_url: env.sunbird_portal_offline_app_download_url || 'https://sunbird-ed.github.io/sunbird-style-guide/dist/#/test-page',
  sunbird_portal_cdn_blob_url: env.sunbird_portal_cdn_blob_url || '',
  sunbird_portal_log_level: env.sunbird_portal_log_level || 'debug',
  REPORT_SERVICE_URL: env.sunbird_report_service_url || 'https://staging.open-sunbird.org/api/data/v1/report-service',
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
    COLLECTION_EDITOR: env.sunbird_collectionEditorURL || '/thirdparty/editors/collection-editor/index.html',
    CONTENT_EDITOR: env.sunbird_contentEditorURL || '/thirdparty/editors/content-editor/index.html',
    GENERIC_EDITOR: env.sunbird_genericEditorURL || '/thirdparty/editors/generic-editor/index.html'
  },
  sunbird_kid_public_key_base_path: env.sunbird_kid_public_key_base_path || '/keys/',
  // discussion forum 
  discussion_forum_token: env.discussion_forum_token || 'a4838b88-6a04-4293-a504-245862cad404',
  discussions_middleware: env.discussions_middleware || 'http://disussionsmw-service:3002/discussion',
  PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'in-memory',
  // PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'cassandra',
  // PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'redis',
  PORTAL_REDIS_TYPE: env.sunbird_redis_type || 'standalone',
  PORTAL_API_WHITELIST_CHECK: env.sunbird_portal_api_whitelist || 'true',
  // PORTAL_REDIS_URL: env.sunbird_redis_urls || 'sunbird-dev-redis.redis.cache.windows.net',
  PORTAL_REDIS_URL: env.sunbird_redis_urls || 'sunbird-dev-redis.redis.cache.windows.net',
  PORTAL_REDIS_PORT: env.sunbird_redis_port || 6380,
  PORTAL_REDIS_CONNECTION_STRING: env.portal_redis_connection_string || 'redis://127.0.0.1:6379',
  KONG_DEVICE_REGISTER_TOKEN: env.sunbird_kong_device_register || 'true',
  PORTAL_SESSION_SECRET_KEY: "sunbird,717b3357-b2b1-4e39-9090-1c712d1b8b64".split(','),
  KONG_DEVICE_REGISTER_AUTH_TOKEN: env.sunbird_kong_device_register_token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIxcERmNXQxTmxJeWhYM2tuODR1MWxxREo1eW42bndERCJ9.tjwWXSi_Y9asebg0zeH9g12zQDOFz2qLPfOOXu04eRw',
}
devEnvVariables.PORTAL_CASSANDRA_URLS = ['localhost:9042']
// devEnvVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '') ? env.sunbird_cassandra_urls.split(',') : ['localhost']
// module.exports = devEnvVariables
/**
 * ==============================================================================================================================================================================================================
 * Staging Server
 */
let stagingEnvVariables = {
  TRACE_ID_ENABLED: env.isTraceEnabled || true,
  KEYCLOAK_GOOGLE_DESKTOP_CLIENT: {
    clientId: env.sunbird_google_desktop_keycloak_client_id || 'zz',
    secret: env.sunbird_google_desktop_keycloak_secret || 'zz'
  },
  KEYCLOAK_TRAMPOLINE_DESKTOP_CLIENT: {
    clientId: env.sunbird_trampoline_desktop_keycloak_client_id,
    secret: env.sunbird_trampoline_desktop_keycloak_secret
  },
  KEYCLOAK_DESKTOP_CLIENT: {
    clientId: env.sunbird_desktop_keycloak_client_id || 'desktop',
  },
  // discussion forum 
  discussion_forum_token: env.discussion_forum_token || 'a4838b88-6a04-4293-a504-245862cad404',
  discussions_middleware: env.discussions_middleware || 'http://disussionsmw-service:3002/discussion',
  sunbird_instance_name: env.sunbird_instance || 'Sunbird',
  sunbird_device_api: 'https://sunbird.stackroutelabs.com/api/',
  sunbird_portal_base_url: 'https://sunbird.stackroutelabs.com',
  SUNBIRD_PORTAL_BASE_URL: 'https://sunbird.stackroutelabs.com',
  LEARNER_URL: env.sunbird_learner_player_url || 'https://sunbird.stackroutelabs.com/api/',
  CONTENT_URL: env.sunbird_content_player_url || 'https://sunbird.stackroutelabs.com/api/',
  CONTENT_PROXY_URL: env.sunbird_content_proxy_url || 'https://staging.sunbirded.org',
  PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
  PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || 'https://sunbird.stackroutelabs.com/auth',
  // PORTAL_AUTH_SERVER_URL: 'http://localhost:8080/auth',
  PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',
  APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
  DEFAULT_TENANT: 'ntp',
  DEFAULT_CHANNEL: 'ntp',
  EKSTEP_ENV: env.ekstep_env || 'qa',
  PORTAL_PORT: env.sunbird_port || 3000,
  PORTAL_MERGE_AUTH_SERVER_URL: 'https://merge.staging.ntp.net.in/auth',
  PORTAL_API_AUTH_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2eDFyQjhsdjNRQXZ4NmpJY1h6VkxQMmU3d0djUlZhUyJ9.eTDqiChU8Sp5h1pUiv0eSp36rr5FNNQurBD6OT4E0v0',
  PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 1000,
  PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || 'https://sunbird.stackroutelabs.com/api/echo/',
  PORTAL_AUTOCREATE_TRAMPOLINE_USER: env.sunbird_autocreate_trampoline_user || 'true',
  PORTAL_TRAMPOLINE_CLIENT_ID: env.sunbird_trampoline_client_id || 'trampoline',
  PORTAL_TRAMPOLINE_SECRET: env.sunbird_trampoline_secret,
  ENABLE_PERMISSION_CHECK: 1 || 0,
  PORTAL_TITLE_NAME: env.sunbird_instance || 'Sunbird',
  PORTAL_CDN_URL: env.sunbird_portal_cdn_url || '',
  PORTAL_THEME: env.sunbird_theme || 'default',
  PORTAL_DEFAULT_LANGUAGE: env.sunbird_portal_default_language || 'en',
  PORTAL_PRIMARY_BUNDLE_LANGUAGE: env.sunbird_portal_primary_bundle_language || 'en',
  CONTENT_SERVICE_UPSTREAM_URL: env.sunbird_content_service_upstream_url || 'http://localhost:5000/',
  LEARNER_SERVICE_UPSTREAM_URL: env.sunbird_learner_service_upstream_url || 'http://localhost:9000/',
  DATASERVICE_URL: env.sunbird_dataservice_url || 'https://sunbird.stackroutelabs.com/api/',
  KEY_CLOAK_PUBLIC: env.sunbird_keycloak_public || 'true',
  KEY_CLOAK_REALM: env.sunbird_keycloak_realm || 'sunbird',
  CACHE_STORE: env.sunbird_cache_store || 'memory',
  CACHE_TTL: env.sunbird_cache_ttl || 1800,
  learner_Service_Local_BaseUrl: env.sunbird_learner_service_local_base_url || 'http://learner-service:9000',
  content_Service_Local_BaseUrl: env.sunbird_content_service_local_base_url || 'http://content_service_content_service:5000',
  ANDROID_APP_URL: env.sunbird_android_app_url || 'http://www.sunbird.org',
  EXPLORE_BUTTON_VISIBILITY: env.sunbird_explore_button_visibility || 'true',
  ENABLE_SIGNUP: env.sunbird_enable_signup || 'true',
  BUILD_NUMBER: env.sunbird_build_number || packageObj.version + '.' + packageObj.buildHash,
  // TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'http://telemetry-service:9001/',
  TELEMETRY_SERVICE_LOCAL_URL: 'https://sunbird.stackroutelabs.com/',
  PORTAL_API_CACHE_TTL: env.sunbird_api_response_cache_ttl || '600',
  SUNBIRD_EXTCONT_WHITELISTED_DOMAINS: env.sunbird_extcont_whitelisted_domains || 'youtube.com,youtu.be',
  TENANT_CDN_URL: env.sunbird_tenant_cdn_url || '',
  PORTAL_EXT_PLUGIN_URL: 'https://dev.open-sunbird.org/action/',
  CLOUD_STORAGE_URLS: env.sunbird_cloud_storage_urls,
  PORTAL_USER_UPLOAD_REF_LINK: env.sunbird_portal_user_upload_ref_link || 'http://www.sunbird.org/features-documentation/register_user',
  GOOGLE_OAUTH_CONFIG: {
    clientId: '981305909557-me68o0gue61mvjaossadlu6f8eblg4g8.apps.googleusercontent.com',
    clientSecret: 'LWjySTVO1h-qeuLy75tGVwhe'
  },
  KEYCLOAK_GOOGLE_CLIENT: {
    clientId: "google-auth",
    secret: "2bbdd3e0-dfd1-4b88-ab6a-8f1a0c659ab0"
  },
  sunbird_google_captcha_site_key: env.sunbird_google_captcha_site_key || '6Ld9vLkZAAAAAOMwMW_ktqYNBE3lp1PzKNxn2kUH',
  google_captcha_private_key: '6Ld9vLkZAAAAAMTd_eo67ic5-iWRR7ndNsAdekhb',
  CRYPTO_ENCRYPTION_KEY: '030702bc8696b8ee2aa71b9f13e4251e',
  sunbird_p1_reCaptcha_enabled: false,
  sunbird_p2_reCaptcha_enabled: false,
  sunbird_p3_reCaptcha_enabled: false,
  sunbird_azure_report_container_name: 'reports',
  sunbird_azure_account_name: env.sunbird_azure_account_name || 'sunbirddev',
  sunbird_azure_account_key: env.sunbird_azure_account_key || 'XcRoJsGkl8Gq5LpMm9Hnm0AEd3GpCHi7ck1qcdovIcN2VMWIvKiYtOEHHALeIq/5GJ9wrs6DUPszF9mV6tB9Qg==',
  // sunbird_azure_account_name: 'ntpstaging',
  // sunbird_azure_account_key: '8WYZ82lRoQ4RTBLDLsa829angd3v4/FLTOerVANXhrro8Evj0nvpByHDwVoEeQbt91hgJyX3oQRypvsdOll9kA==',
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
  sunbird_portal_cdn_blob_url: env.sunbird_portal_cdn_blob_url || '',
  sunbird_portal_log_level: env.sunbird_portal_log_level || 'debug',
  DEVICE_REGISTER_API: process.env.sunbird_device_register_api || 'https://api.dev.sunbirded.org/v3/device/register/',
  REPORT_SERVICE_URL: env.sunbird_report_service_url || 'https://staging.open-sunbird.org/api/data/v1/report-service',
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
    COLLECTION_EDITOR: env.sunbird_collectionEditorURL || '/thirdparty/editors/collection-editor/index.html',
    CONTENT_EDITOR: env.sunbird_contentEditorURL || '/thirdparty/editors/content-editor/index.html',
    GENERIC_EDITOR: env.sunbird_genericEditorURL || '/thirdparty/editors/generic-editor/index.html'
  },
  sunbird_kid_public_key_base_path: env.sunbird_kid_public_key_base_path || '/keys/',
  PORTAL_REDIS_URL: 'localhost',
  PORTAL_REDIS_PORT: 9001,
  sunbird_data_product_service: env.sunbird_data_product_service || 'https://sunbird.stackroutelabs.com/',
  sunbird_session_ttl: env.sunbird_session_ttl ? parseInt(env.sunbird_session_ttl) : 24 * 60 * 60 * 1000,
  // sunbird_session_ttl: parseInt(120000), // 2 minutes
  // sunbird_session_ttl: parseInt(600000),
  PORTAL_CASSANDRA_REPLICATION_STRATEGY: '{"class":"SimpleStrategy","replication_factor":1}',
  PHRASE_APP: {
    phrase_authToken: env.sunbird_phraseApp_token || '',
    phrase_project: env.phrase_project || 'DIKSHA Portal,Sunbird Creation',
    phrase_locale: env.phrase_locale || ['en-IN', 'bn-IN', 'hi-IN', 'kn-IN', 'mr-IN', 'ur-IN', 'te-IN', 'ta-IN'],
    phrase_fileformat: env.phrase_fileformat || 'json'
  },
  KONG_DEVICE_REGISTER_TOKEN: env.sunbird_kong_device_register || 'true',
  KONG_DEVICE_REGISTER_AUTH_TOKEN: env.sunbird_kong_device_register_token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIxcERmNXQxTmxJeWhYM2tuODR1MWxxREo1eW42bndERCJ9.tjwWXSi_Y9asebg0zeH9g12zQDOFz2qLPfOOXu04eRw',
  PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'in-memory',
  // PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'cassandra',
  // PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'redis',
  PORTAL_REDIS_TYPE: env.sunbird_redis_type || 'cluster',
  PORTAL_API_WHITELIST_CHECK: env.sunbird_portal_api_whitelist || 'false',
  PORTAL_SESSION_SECRET_KEY: "sunbird,717b3357-b2b1-4e39-9090-1c712d1b8b64".split(',')
}
stagingEnvVariables.PORTAL_CASSANDRA_URLS = ['localhost:9042']
// stagingEnvVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '') ? env.sunbird_cassandra_urls.split(',') : ['localhost']
// module.exports = stagingEnvVariables
if (__envIn == 'dev') {
  module.exports = devEnvVariables
} else if (__envIn == 'staging') {
  module.exports = stagingEnvVariables
} else if (__envIn == 'loadtest') {
  module.exports = loadtest;
} else if (__envIn == 'preprod') {
  module.exports = preprodEnvVariables
}
// try {
//   console.log('-------------------'); // TODO: log!
//   console.log("req.ip - ", req.ip)
//   console.log("req.headers['x-forwarded-for'] - ", req.headers['x-forwarded-for'])
//   console.log("req.connection.remoteAddress - ", req.connection.remoteAddress)
//   console.log("req.socket.remoteAddress - ", req.socket.remoteAddress)
//   console.log("req.connection.socket.remoteAddress - ", req.connection.socket.remoteAddress)
//   console.log('-------------------'); // TODO: log!
// } catch (error) {
// }











//Staging


// 'use strict'
// const env = process.env
// const fs = require('fs')
// const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'));
// let envVariables = {
//   sunbird_data_product_service: 'abc',
//   sunbird_azure_resourceBundle_container_name: env.sunbird_azure_resourceBundle_container_name || 'label',
//   sunbird_kid_public_key_base_path: env.sunbird_kid_public_key_base_path || '/keys/',
//   REPORT_SERVICE_URL: 'https://dev.sunbirded.org/api/data/v1/report-service',
//   reportsListVersion: env.reportsListVersion || 'v1',
//   LEARNER_URL: env.sunbird_learner_player_url || 'https://staging.sunbirded.org/api/',
//   CONTENT_URL: env.sunbird_content_player_url || 'https://staging.sunbirded.org/api/',
//   CONTENT_PROXY_URL: env.sunbird_content_proxy_url || 'https://staging.sunbirded.org',
//   PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
//   PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || 'https://staging.sunbirded.org/auth',
//   PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',
//   APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
//   DEFAULT_TENANT: 'ntp',
//   DEFAULT_CHANNEL: 'ntp',
//   EKSTEP_ENV: env.ekstep_env || 'qa',
//   DEVICE_REGISTER_API: process.env.sunbird_device_register_api || 'https://api.open-sunbird.org/v3/device/register/',
//   DEVICE_PROFILE_API: process.env.sunbird_device_profile_api || 'https://staging.open-sunbird.org/api/v3/device/profile/',
//   sunbird_theme: env.sunbird_theme || 'default',
//   BUILD_NUMBER: packageObj.version + '.' + packageObj.buildHash,
//   sunbird_portal_log_level: env.sunbird_portal_log_level || 'debug',
//   sunbird_extcont_whitelisted_domains: env.sunbird_extcont_whitelisted_domains || 'youtube.com,youtu.be',
//   sunbird_explore_button_visibility: env.sunbird_explore_button_visibility || 'true',
//   sunbird_help_link_visibility: env.sunbird_help_link_visibility || 'false',
//   sunbird_portal_user_upload_ref_link: env.sunbird_portal_user_upload_ref_link || 'http://www.sunbird.org/features-documentation/register_user',
//   ENABLE_PERMISSION_CHECK: env.sunbird_enabless_permission_check || 0,
//   CONFIG_SERVICE_ENABLED: env.config_service_enabled || false,
//   CRYPTO_ENCRYPTION_KEY: env.crypto_encryption_key || '030702bc8696b8ee2aa71b9f13e4251e',
//   LOG_FINGERPRINT_DETAILS: env.sunbird_log_fingerprint_details || 'true',
//   REPORT_SERVICE_URL: env.sunbird_report_service_url || 'https://staging.open-sunbird.org/api/data/v1/report-service',
//   SUNBIRD_PORTAL_BASE_URL: env.sunbird_portal_base_url,
//   sunbird_device_api: env.sunbird_device_api || 'https://staging.sunbirded.org/api/',
//   sunbird_portal_slugForProminentFilter: env.sunbird_portal_slugForProminentFilter,
//   // discussion forum
//   discussion_forum_token: env.discussion_forum_token || 'a4838b88-6a04-4293-a504-245862cad404',
//   discussions_middleware: env.discussions_middleware || 'http://localhost:3002',
//   // TTL and Intervals
//   CONFIG_REFRESH_INTERVAL: env.config_refresh_interval || 10,
//   PORTAL_API_CACHE_TTL: env.sunbird_api_response_cache_ttl || '600',
//   CACHE_TTL: env.sunbird_cache_ttl || 1800,
//   RESPONSE_CACHE_TTL: env.sunbird_response_cache_ttl || '180', // used in tenant helper to cache the tenant response info
//   sunbird_portal_updateLoginTimeEnabled: env.sunbird_portal_updateLoginTimeEnabled || false,
//   // Telemetry Configuration
//   PORTAL_PORT: env.sunbird_port || 3000,
//   PORTAL_MERGE_AUTH_SERVER_URL: 'https://merge.staging.sunbirded.org/auth',
//   PORTAL_API_AUTH_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJKa21PZDJGMzdmak1Vb3ZsdnBZclRCN3ZwTHlTV2dwWiJ9.Te7nCwnpPx5mx0P7cnveXtErMMSuarqALdiS1PFanW0', PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 1000,
//   PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || 'https://staging.sunbirded.org/api/echo/',
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
//   PORTAL_SESSION_SECRET_KEY: "sunbird,717b3357-b2b1-4e39-9090-1c712d1b8b64".split(','),
//   CONTENT_SERVICE_UPSTREAM_URL: env.sunbird_content_service_upstream_url || 'http://localhost:5000/',
//   LEARNER_SERVICE_UPSTREAM_URL: env.sunbird_learner_service_upstream_url || 'http://localhost:9000/',
//   DATASERVICE_URL: env.sunbird_dataservice_url || 'https://staging.sunbirded.org/api/',
//   KEY_CLOAK_PUBLIC: env.sunbird_keycloak_public || 'true',
//   KEY_CLOAK_REALM: env.sunbird_keycloak_realm || 'sunbird',
//   CACHE_STORE: env.sunbird_cache_store || 'memory',
//   CACHE_TTL: env.sunbird_cache_ttl || 1800,
//   learner_Service_Local_BaseUrl: env.sunbird_learner_service_local_base_url || 'http://learner-service:9000',
//   content_Service_Local_BaseUrl: env.sunbird_content_service_local_base_url || 'http://content_service_content_service:5000',
//   ANDROID_APP_URL: env.sunbird_android_app_url || 'http://www.sunbird.org',
//   EXPLORE_BUTTON_VISIBILITY: env.sunbird_explore_button_visibility || 'true',
//   ENABLE_SIGNUP: env.sunbird_enable_signup || 'true',
//   BUILD_NUMBER: env.sunbird_build_number || packageObj.version + '.' + packageObj.buildHash,
//   TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'http://telemetry-service:9001/',
//   PORTAL_API_CACHE_TTL: env.sunbird_api_response_cache_ttl || '600',
//   SUNBIRD_EXTCONT_WHITELISTED_DOMAINS: env.sunbird_extcont_whitelisted_domains || 'youtube.com,youtu.be',
//   TENANT_CDN_URL: env.sunbird_tenant_cdn_url || '',
//   PORTAL_EXT_PLUGIN_URL: 'https://dev.open-sunbird.org/action/',
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
//   CONTENT_EDITORS_CDN_URL: {
//     COLLECTION_EDITOR: env.sunbird_collectionEditorCDN || '',
//     CONTENT_EDITOR: env.sunbird_contentEditorCDN || '',
//     GENERIC_EDITOR: env.sunbird_genericEditorCDN || ''
//   },
//   sunbird_google_captcha_site_key: env.sunbird_google_captcha_site_key,
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
//   DESKTOP_APP_STORAGE_URL: env.desktop_app_storage_url,
//   // CDN Configuration
//   PORTAL_CDN_URL: env.sunbird_portal_cdn_url || '',
//   TENANT_CDN_URL: env.sunbird_tenant_cdn_url || '',
//   sunbird_portal_preview_cdn_url: env.sunbird_portal_preview_cdn_url,
//   // Kafka Configuration
//   sunbird_processing_kafka_host: process.env.sunbird_processing_kafka_host,
//   sunbird_sso_kafka_topic: process.env.sunbird_sso_kafka_topic,
//   sunbird_portal_cdn_blob_url: env.sunbird_portal_cdn_blob_url || '',
//   sunbird_portal_log_level: env.sunbird_portal_log_level || 'debug',
//   DEVICE_REGISTER_API: process.env.sunbird_device_register_api || 'https://api.dev.sunbirded.org/v3/device/register/',
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
//   KEYCLOAK_ANDROID_CLIENT: {
//     clientId: env.sunbird_android_keycloak_client_id || 'android',
//   },
//   KEYCLOAK_GOOGLE_DESKTOP_CLIENT: {
//     clientId: env.sunbird_google_desktop_keycloak_client_id,
//     secret: env.sunbird_google_desktop_keycloak_secret
//   },
//   KEYCLOAK_TRAMPOLINE_DESKTOP_CLIENT: {
//     clientId: env.sunbird_trampoline_desktop_keycloak_client_id,
//     secret: env.sunbird_trampoline_desktop_keycloak_secret
//   },
//   KEYCLOAK_DESKTOP_CLIENT: {
//     clientId: env.sunbird_desktop_keycloak_client_id || 'desktop',
//   },
//   CONTENT_EDITORS_URL: {
//     COLLECTION_EDITOR: '/thirdparty/editors/collection-editor/index.html',
//     CONTENT_EDITOR: '/thirdparty/editors/content-editor/index.html',
//     GENERIC_EDITOR: '/thirdparty/editors/generic-editor/index.html'
//   },
//   PHRASE_APP: {
//     phrase_authToken: env.sunbird_phraseApp_token || '',
//     phrase_project: env.phrase_project || 'DIKSHA Portal,Sunbird Creation',
//     phrase_locale: env.phrase_locale || ['en-IN', 'bn-IN', 'hi-IN', 'kn-IN', 'mr-IN', 'ur-IN', 'te-IN', 'ta-IN'],
//     phrase_fileformat: env.phrase_fileformat || 'json'
//   },
// }
// envVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '')
//   ? env.sunbird_cassandra_urls.split(',') : ['localhost']
// module.exports = envVariables