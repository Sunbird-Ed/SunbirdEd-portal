'use strict'
const env = process.env
const fs = require('fs')
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const __envIn = 'dev';
//  const __envIn = 'staging';
// const __envIn = 'preprod';
// const __envIn = 'contributer';
// const __envIn = 'newStaging';

// DEV Environment
let devEnvVariables = {
  sunbird_data_product_service: 'abc',
  sunbird_azure_resourceBundle_container_name: env.sunbird_azure_resourceBundle_container_name || 'label',
  sunbird_kid_public_key_base_path: env.sunbird_kid_public_key_base_path || '/keys/',
  REPORT_SERVICE_URL: 'https://dev.sunbirded.org/api/data/v1/report-service',
  LEARNER_URL: env.sunbird_learner_player_url || 'https://dev.sunbirded.org/api/',
  CONTENT_URL: env.sunbird_content_player_url || 'https://dev.sunbirded.org/api/',
  CONFIG_URL: env.sunbird_config_service_url || 'https://dev.sunbirded.org/api/config/',
  CONFIG_REFRESH_INTERVAL: env.config_refresh_interval || 10,
  CONFIG_SERVICE_ENABLED: env.config_service_enabled || false,
  CONTENT_PROXY_URL: env.sunbird_content_proxy_url || 'https://dev.sunbirded.org',
  PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
  PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || 'https://dev.sunbirded.org/auth',
  PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',
  APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
  DEFAULT_CHANNEL: env.sunbird_default_channel || 'tn',
  EKSTEP_ENV: env.ekstep_env || 'qa',
  PORTAL_PORT: env.sunbird_port || 3000,
  PORTAL_API_AUTH_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyZThlNmU5MjA4YjI0MjJmOWFlM2EzNjdiODVmNWQzNiJ9.gvpNN7zEl28ZVaxXWgFmCL6n65UJfXZikUWOKSE8vJ8',
  PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 1000,
  PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || 'https://dev.sunbirded.org/api/echo/',
  PORTAL_AUTOCREATE_TRAMPOLINE_USER: env.sunbird_autocreate_trampoline_user || 'true',
  PORTAL_TRAMPOLINE_CLIENT_ID: 'trampoline',
  PORTAL_TRAMPOLINE_SECRET: '36c4277f-d59b-4ea2-b788-964b96bd47d1',
  ENABLE_PERMISSION_CHECK: 1 || 0,
  PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'in-memory',
  PORTAL_CDN_URL: env.sunbird_portal_cdn_url || '',
  CONTENT_SERVICE_UPSTREAM_URL: env.sunbird_content_service_upstream_url || 'http://localhost:5000/',
  LEARNER_SERVICE_UPSTREAM_URL: env.sunbird_learner_service_upstream_url || 'http://localhost:9000/',
  DATASERVICE_URL: env.sunbird_dataservice_url || 'https://dev.sunbirded.org/api/',
  KEY_CLOAK_PUBLIC: env.sunbird_keycloak_public || 'true',
  KEY_CLOAK_REALM: env.sunbird_keycloak_realm || 'sunbird',
  CACHE_STORE: env.sunbird_cache_store || 'memory',
  CACHE_TTL: env.sunbird_cache_ttl || 1800,
  ANDROID_APP_URL: env.sunbird_android_app_url || 'http://www.sunbird.org',
  BUILD_NUMBER: env.sunbird_build_number || packageObj.version + '.' + packageObj.buildHash,
  TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'http://telemetry-service:9001/',
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
    clientId: env.sunbird_google_oauth_clientId  || '671624305038-e8pbpmidst6lf0j5qplp6g6odan3lbf5.apps.googleusercontent.com' || '903729999899-7vcrph3vro36ot43j1od8u6he9jjend0.apps.googleusercontent.com',
    clientSecret: env.sunbird_google_oauth_clientSecret || 'mDO2MM68iW23f47ZFtvREld9' || 'BAEAYRv7voTByz5rOKkbIE3u' 
  },
  KEYCLOAK_GOOGLE_CLIENT: {
    clientId: env.sunbird_google_keycloak_client_id || 'google-auth',
    secret: env.sunbird_google_keycloak_secret || '8486df4b-2ec0-4249-92d8-5f3a7064cd07'
  },
  sunbird_google_captcha_site_key: env.sunbird_google_captcha_site_key || '6Ldcf4EUAAAAAMrKQSviNtEzMretoDgeAUxqJv7d',
  sunbird_azure_report_container_name: env.sunbird_azure_report_container_name || 'reports',
  sunbird_azure_account_name: env.sunbird_azure_account_name || 'sunbirddev',
  sunbird_azure_account_key: env.sunbird_azure_account_key || 'hVZeCECRUwsIZEL2h+GqF3bRo5Iz365G+zhrOZlYYYXBmrjuv4NyBv47xsmcvyQvAQPnnLG9r9iGil9TLgeyeA==',
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
  KEYCLOAK_GOOGLE_ANDROID_CLIENT: {
    clientId: env.sunbird_google_android_keycloak_client_id,
    secret: env.sunbird_google_android_keycloak_secret
  },
  // discussion forum 
  discussion_forum_token: env.discussion_forum_token || 'a4838b88-6a04-4293-a504-245862cad404',
  discussions_middleware: env.discussions_middleware || 'http://localhost:3002',
// discussions_middleware: env.discussions_middleware || 'http://disussionsmw-service:3002/discussion',
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
  KEYCLOAK_TRAMPOLINE_ANDROID_CLIENT: {
    clientId: env.sunbird_trampoline_android_keycloak_client_id,
    secret: env.sunbird_trampoline_android_keycloak_secret
  },
  KEYCLOAK_ANDROID_CLIENT: {
    clientId: env.sunbird_android_keycloak_client_id || 'android',
  },
  KEYCLOAK_GOOGLE_DESKTOP_CLIENT: {
    clientId: env.sunbird_google_desktop_keycloak_client_id,
    secret: env.sunbird_google_desktop_keycloak_secret
  },
  KEYCLOAK_TRAMPOLINE_DESKTOP_CLIENT: {
    clientId: env.sunbird_trampoline_desktop_keycloak_client_id,
    secret: env.sunbird_trampoline_desktop_keycloak_secret
  },
  KEYCLOAK_DESKTOP_CLIENT: {
    clientId: env.sunbird_desktop_keycloak_client_id || 'desktop',
  },
}
devEnvVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '') ?
  env.sunbird_cassandra_urls.split(',') : ['localhost']

// Staging Environment...
let stagingEnvVariables = {
  LEARNER_URL: env.sunbird_learner_player_url || 'https://staging.ntp.net.in/api/',
  sunbird_data_product_service: env.sunbird_data_product_service || 'https://staging.ntp.net.in/',
  sunbird_kid_public_key_base_path: env.sunbird_kid_public_key_base_path || '/keys/',

  CONTENT_URL: env.sunbird_content_player_url || 'https://staging.ntp.net.in/api/',
  CONTENT_PROXY_URL: env.sunbird_content_proxy_url || 'https://staging.ntp.net.in',
  PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
  PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || 'https://staging.ntp.net.in/auth',
  PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',
  APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
  DEFAULT_TENANT: 'ntp',
  DEFAULT_CHANNEL: 'ntp',
  EKSTEP_ENV: env.ekstep_env || 'qa',
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
  REPORT_SERVICE_URL: "https://staging.ntp.net.in/api/data/v1/report-service" || env.sunbird_report_service_url || 'https://staging.open-sunbird.org/api/data/v1/report-service',
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
  BUILD_NUMBER: env.sunbird_build_number || packageObj.version + '.' + packageObj.buildHash,
  TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'http://telemetry-service:9001/',
  PORTAL_API_CACHE_TTL: env.sunbird_api_response_cache_ttl || '600',
  SUNBIRD_EXTCONT_WHITELISTED_DOMAINS: env.sunbird_extcont_whitelisted_domains || 'youtube.com,youtu.be',
  TENANT_CDN_URL: env.sunbird_tenant_cdn_url || '',
  PORTAL_EXT_PLUGIN_URL: 'https://dev.open-sunbird.org/action/',
  CLOUD_STORAGE_URLS: env.sunbird_cloud_storage_urls,
  Sunbird_bot_configured: 'false',
  Sunbird_bot_service_URL: 'chatapi/bot',
  sunbird_super_admin_slug: "sunbirdqa011" || env.sunbird_super_admin_slug || 'sunbird',
  PORTAL_USER_UPLOAD_REF_LINK: env.sunbird_portal_user_upload_ref_link || 'http://www.sunbird.org/features-documentation/register_user',
  GOOGLE_OAUTH_CONFIG: {
    clientId: env.sunbird_google_oauth_clientId,
    clientSecret: env.sunbird_google_oauth_clientSecret
  },
  KEYCLOAK_GOOGLE_CLIENT: {
    clientId: env.sunbird_google_keycloak_client_id,
    secret: env.sunbird_google_keycloak_secret
  },
  sunbird_google_captcha_site_key: '6Ldk3O8UAAAAAC2tm0qkPGbJC7YJVpVzMeIuhumb',
  google_captcha_private_key: '6Ldk3O8UAAAAADomyNFfGHh-bGf0_z6FzaHR4N35',
  sunbird_azure_account_name: 'ntpstaging',
  sunbird_azure_report_container_name: 'reports',
  sunbird_azure_account_key: '8WYZ82lRoQ4RTBLDLsa829angd3v4/FLTOerVANXhrro8Evj0nvpByHDwVoEeQbt91hgJyX3oQRypvsdOll9kA==',
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
    COLLECTION_EDITOR: env.sunbird_collectionEditorURL || 'collection-editor/index.html',
    CONTENT_EDITOR: env.sunbird_contentEditorURL || 'content-editor/index.html',
    GENERIC_EDITOR: env.sunbird_genericEditorURL || 'generic-editor/index.html'
  }
}
stagingEnvVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '') ?
  env.sunbird_cassandra_urls.split(',') : ['localhost']

// Preprod environment...
let preprodEnvVariables = {
  LEARNER_URL: env.sunbird_learner_player_url || 'https://preprod.ntp.net.in/api/',
  sunbird_data_product_service: env.sunbird_data_product_service || 'https://staging.ntp.net.in/',
  sunbird_kid_public_key_base_path: env.sunbird_kid_public_key_base_path || '/keys/',

  CONTENT_URL: env.sunbird_content_player_url || 'https://preprod.ntp.net.in/api/',
  CONTENT_PROXY_URL: env.sunbird_content_proxy_url || 'https://preprod.ntp.net.in',
  PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
  PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || 'https://preprod.ntp.net.in/auth',
  PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',
  APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
  DEFAULT_TENANT: 'ntp',
  DEFAULT_CHANNEL: 'ntp',
  EKSTEP_ENV: env.ekstep_env || 'qa',
  PORTAL_PORT: env.sunbird_port || 3000,
  Sunbird_bot_configured: 'true',
  Sunbird_bot_service_URL: 'https://dev.sunbirded.org/chatapi/bot',
  PORTAL_MERGE_AUTH_SERVER_URL: 'https://merge.preprod.ntp.net.in/auth',
  PORTAL_API_AUTH_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiYWIwZTIyMmZiNTA0NGU5YTNmZWJhYTM3YWRjYjI3MSJ9.NOUsCaYUd16dR_RR6_SDiN5TqRB0QL8Zr4x4DQsmZXk',
  PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 1000,
  PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || 'https://preprod.ntp.net.in/api/echo/',
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
  DATASERVICE_URL: env.sunbird_dataservice_url || 'https://preprod.ntp.net.in/api/',
  KEY_CLOAK_PUBLIC: env.sunbird_keycloak_public || 'true',
  KEY_CLOAK_REALM: env.sunbird_keycloak_realm || 'sunbird',
  CACHE_STORE: env.sunbird_cache_store || 'memory',
  REPORT_SERVICE_URL: 'https://preprod.ntp.net.in/api/data/v1/report-service' || env.sunbird_report_service_url || 'https://staging.open-sunbird.org/api/data/v1/report-service',
  CACHE_TTL: env.sunbird_cache_ttl || 1800,
  learner_Service_Local_BaseUrl: env.sunbird_learner_service_local_base_url || 'http://learner-service:9000',
  content_Service_Local_BaseUrl: env.sunbird_content_service_local_base_url || 'http://content_service_content_service:5000',
  ANDROID_APP_URL: env.sunbird_android_app_url || 'http://www.sunbird.org',
  EXPLORE_BUTTON_VISIBILITY: env.sunbird_explore_button_visibility || 'true',
  ENABLE_SIGNUP: env.sunbird_enable_signup || 'true',
  BUILD_NUMBER: env.sunbird_build_number || packageObj.version + '.' + packageObj.buildHash,
  TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'http://telemetry-service:9001/',
  PORTAL_API_CACHE_TTL: env.sunbird_api_response_cache_ttl || '600',
  SUNBIRD_EXTCONT_WHITELISTED_DOMAINS: env.sunbird_extcont_whitelisted_domains || 'youtube.com,youtu.be',
  TENANT_CDN_URL: env.sunbird_tenant_cdn_url || '',
  PORTAL_EXT_PLUGIN_URL: 'https://dev.open-sunbird.org/action/',
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
  sunbird_google_captcha_site_key: '6Ldk3O8UAAAAAC2tm0qkPGbJC7YJVpVzMeIuhumb',
  google_captcha_private_key: '6Ldk3O8UAAAAADomyNFfGHh-bGf0_z6FzaHR4N35',
  sunbird_azure_report_container_name: env.sunbird_azure_report_container_name || 'reports',
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
    COLLECTION_EDITOR: env.sunbird_collectionEditorURL || '/thirdparty/editors/collection-editor/index.html',
    CONTENT_EDITOR: env.sunbird_contentEditorURL || '/thirdparty/editors/content-editor/index.html',
    GENERIC_EDITOR: env.sunbird_genericEditorURL || '/thirdparty/editors/generic-editor/index.html'
  }
}
preprodEnvVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '') ?
  env.sunbird_cassandra_urls.split(',') : ['localhost']

// contributer Environment...
let contributerEnvVariables = {
  LEARNER_URL: env.sunbird_learner_player_url || 'https://contributions.sunbirded.org/api/',
  sunbird_data_product_service: env.sunbird_data_product_service || 'https://contributions.sunbirded.org/',
  sunbird_kid_public_key_base_path: env.sunbird_kid_public_key_base_path || '/keys/',

  CONTENT_URL: env.sunbird_content_player_url || 'https://contributions.sunbirded.org/api/',
  CONTENT_PROXY_URL: env.sunbird_content_proxy_url || 'https://contributions.sunbirded.org',
  PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
  PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || 'https://contributions.sunbirded.org/auth',
  PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',
  APPID: 'dev' + '.' + 'dev' + '.portal',
  DEFAULT_TENANT: 'ntp',
  DEFAULT_CHANNEL: 'ntp',
  EKSTEP_ENV: env.ekstep_env || 'qa',
  PORTAL_PORT: env.sunbird_port || 3000,
  PORTAL_MERGE_AUTH_SERVER_URL: 'https://merge.contributions.sunbirded.org/auth',
  PORTAL_API_AUTH_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4V3RxdTVxN2k2SGdiTGFsc2Y3UDIzUFFQdHVWWnRtdyJ9.qIJ_Wj9jcsE43aPdJqAOsS9ou4Gn7_9A4-WuGyj59Xw',
  PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 1000,
  PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || 'https://contributions.sunbirded.org/api/echo/',
  PORTAL_AUTOCREATE_TRAMPOLINE_USER: env.sunbird_autocreate_trampoline_user || 'true',
  PORTAL_TRAMPOLINE_CLIENT_ID: env.sunbird_trampoline_client_id || 'trampoline',
  PORTAL_TRAMPOLINE_SECRET: env.sunbird_trampoline_secret,
  ENABLE_PERMISSION_CHECK: env.sunbird_enabless_permission_check || 0,
  PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'in-memory',
  PORTAL_TITLE_NAME: env.sunbird_instance || 'Sunbird',
  PORTAL_CDN_URL: env.sunbird_portal_cdn_url || '',
  PORTAL_THEME: env.sunbird_theme || 'default',
  REPORT_SERVICE_URL: "https://contributions.sunbirded.org/api/data/v1/report-service" || env.sunbird_report_service_url || 'https://staging.open-sunbird.org/api/data/v1/report-service',
  PORTAL_DEFAULT_LANGUAGE: env.sunbird_portal_default_language || 'en',
  PORTAL_PRIMARY_BUNDLE_LANGUAGE: env.sunbird_portal_primary_bundle_language || 'en',
  CONTENT_SERVICE_UPSTREAM_URL: env.sunbird_content_service_upstream_url || 'http://localhost:5000/',
  LEARNER_SERVICE_UPSTREAM_URL: env.sunbird_learner_service_upstream_url || 'http://localhost:9000/',
  DATASERVICE_URL: env.sunbird_dataservice_url || 'https://contributions.sunbirded.org/api/',
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
  TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'http://telemetry-service:9001/',
  PORTAL_API_CACHE_TTL: env.sunbird_api_response_cache_ttl || '600',
  SUNBIRD_EXTCONT_WHITELISTED_DOMAINS: env.sunbird_extcont_whitelisted_domains || 'youtube.com,youtu.be',
  TENANT_CDN_URL: env.sunbird_tenant_cdn_url || '',
  PORTAL_EXT_PLUGIN_URL: 'https://contributions.sunbirded.org/action/',
  CLOUD_STORAGE_URLS: env.sunbird_cloud_storage_urls,
  Sunbird_bot_configured: 'false',
  Sunbird_bot_service_URL: 'chatapi/bot',
  sunbird_super_admin_slug: "sunbirdqa011" || env.sunbird_super_admin_slug || 'sunbird',
  PORTAL_USER_UPLOAD_REF_LINK: env.sunbird_portal_user_upload_ref_link || 'http://www.sunbird.org/features-documentation/register_user',
  GOOGLE_OAUTH_CONFIG: {
    clientId: env.sunbird_google_oauth_clientId || '374464460879-pc1e8pbn7fsff52cfgkt329tugb1oe4m.apps.googleusercontent.com',
    clientSecret: env.sunbird_google_oauth_clientSecret || '4ArdNA5_BSyyq2Jlw_EbuXO0'
  },
  KEYCLOAK_GOOGLE_CLIENT: {
    clientId: env.sunbird_google_keycloak_client_id || 'google-auth',
    secret: env.sunbird_google_keycloak_secret || '7baaa6ee-2d63-4659-9a2d-8b5558e93a68'
  },
  sunbird_google_captcha_site_key: '6Lf24P0ZAAAAAPBChRHkjB9EKzXfcYweJPPpSYKY',
  google_captcha_private_key: '6Lf24P0ZAAAAAC3O_AHn_I1zqjuOZ1CqHQJBgtsv',
  sunbird_azure_account_name: 'contributionportal',
  sunbird_azure_report_container_name: 'reports',
  sunbird_azure_account_key: 'uwU8xkOJmV9BdDu4IhTRsGq9m7B1rdWAxISLKdzPej5BdfaMchmAGrJlU7duwyIsGhFpyY09fhJzn3A2aApEtQ==',
  sunbird_portal_health_check_enabled: env.sunbird_health_check_enable || 'true',
  sunbird_learner_service_health_status: 'true',
  sunbird_content_service_health_status: 'true',
  sunbird_portal_cassandra_db_health_status: 'true',
  sunbird_portal_preview_cdn_url: env.sunbird_portal_preview_cdn_url || '',
  sunbird_processing_kafka_host: process.env.sunbird_processing_kafka_host || '10.3.1.5:9092',
  sunbird_sso_kafka_topic: process.env.sunbird_sso_kafka_topic || 'dev.lms.sso.events',
  sunbird_portal_offline_tenant: env.sunbird_portal_offline_tenant,
  sunbird_portal_offline_supported_languages: env.sunbird_portal_offline_supported_languages,
  sunbird_portal_offline_app_release_date: env.sunbird_portal_offline_app_release_date,
  sunbird_portal_offline_app_version: env.sunbird_portal_offline_app_version,
  sunbird_portal_offline_app_download_url: env.sunbird_portal_offline_app_download_url,
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
    COLLECTION_EDITOR: env.sunbird_collectionEditorURL || 'collection-editor/index.html',
    CONTENT_EDITOR: env.sunbird_contentEditorURL || 'content-editor/index.html',
    GENERIC_EDITOR: env.sunbird_genericEditorURL || 'generic-editor/index.html'
  }
}
contributerEnvVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '') ?
  env.sunbird_cassandra_urls.split(',') : ['localhost']

  //New staging
  let newStagingEnvVariables = {
    LEARNER_URL: env.sunbird_learner_player_url || 'https://staging.sunbirded.org/api/',
    CONTENT_URL: env.sunbird_content_player_url || 'https://staging.sunbirded.org/api/',
    CONFIG_URL: env.sunbird_config_service_url || 'https://staging.sunbirded.org/api/config/',
    // discussion forum 
    discussion_forum_token: env.discussion_forum_token || 'a4838b88-6a04-4293-a504-245862cad404',
    discussions_middleware: env.discussions_middleware || 'http://disussionsmw-service:3002/discussion',
    CONFIG_REFRESH_INTERVAL: env.config_refresh_interval || 10,
    CONFIG_SERVICE_ENABLED: env.config_service_enabled || false,
    CONTENT_PROXY_URL: env.sunbird_content_proxy_url || 'https://staging.sunbirded.org',
    PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
    PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || 'https://staging.sunbirded.org/auth',
    PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',
    APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
    DEFAULT_CHANNEL: env.sunbird_default_channel || 'tn',
    EKSTEP_ENV: env.ekstep_env || 'qa',
    PORTAL_PORT: env.sunbird_port || 3000,
    learner_Service_Local_BaseUrl: 'http://11.2.6.6/',
    REPORT_SERVICE_URL: env.sunbird_report_service_url || 'https://staging.open-sunbird.org/api/data/v1/report-service',
    PORTAL_API_AUTH_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJKa21PZDJGMzdmak1Vb3ZsdnBZclRCN3ZwTHlTV2dwWiJ9.Te7nCwnpPx5mx0P7cnveXtErMMSuarqALdiS1PFanW0',
    PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 1000,
    PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || 'https://staging.sunbirded.org/api/echo/',
    PORTAL_AUTOCREATE_TRAMPOLINE_USER: env.sunbird_autocreate_trampoline_user || 'true',
    PORTAL_TRAMPOLINE_CLIENT_ID: env.sunbird_trampoline_client_id || 'trampoline',
    PORTAL_TRAMPOLINE_SECRET: env.sunbird_trampoline_secret,
    ENABLE_PERMISSION_CHECK: 1 || 0,
    PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'in-memory',
    PORTAL_CDN_URL: env.sunbird_portal_cdn_url || '',
    CONTENT_SERVICE_UPSTREAM_URL: env.sunbird_content_service_upstream_url || 'http://localhost:5000/',
    LEARNER_SERVICE_UPSTREAM_URL: env.sunbird_learner_service_upstream_url || 'http://localhost:9000/',
    DATASERVICE_URL: env.sunbird_dataservice_url || 'https://staging.sunbirded.org/api/',
    KEY_CLOAK_PUBLIC: env.sunbird_keycloak_public || 'true',
    KEY_CLOAK_REALM: env.sunbird_keycloak_realm || 'sunbird',
    CACHE_STORE: env.sunbird_cache_store || 'memory',
    CACHE_TTL: env.sunbird_cache_ttl || 1800,
    ANDROID_APP_URL: env.sunbird_android_app_url || 'http://www.sunbird.org',
    BUILD_NUMBER: env.sunbird_build_number || packageObj.version + '.' + packageObj.buildHash,
    TELEMETRY_SERVICE_LOCAL_URL: 'https://staging.sunbirded.org' || 'http://telemetry-service:9001/',
    PORTAL_API_CACHE_TTL: env.sunbird_api_response_cache_ttl || '600',
    TENANT_CDN_URL: env.sunbird_tenant_cdn_url || '',
    CLOUD_STORAGE_URLS: env.sunbird_cloud_storage_urls,
    PORTAL_CASSANDRA_CONSISTENCY_LEVEL: env.sunbird_cassandra_consistency_level || 'one',
    PORTAL_CASSANDRA_REPLICATION_STRATEGY: '{"class":"SimpleStrategy","replication_factor":1}',
    PORTAL_EXT_PLUGIN_URL: process.env.sunbird_ext_plugin_url || 'http://player_player:3000/plugin/',
    DEVICE_REGISTER_API: process.env.sunbird_device_register_api || 'https://api.open-sunbird.org/v3/device/register/',
    sunbird_instance_name: env.sunbird_instance || 'Sunbird',
    sunbird_theme: env.sunbird_theme || 'default',
    sunbird_default_language: env.sunbird_portal_default_language || 'en',
    sunbird_primary_bundle_language: env.sunbird_portal_primary_bundle_language || 'en',
    //learner_Service_Local_BaseUrl: env.sunbird_learner_service_local_base_url || 'http://learner-service:9000',
    content_Service_Local_BaseUrl: env.sunbird_content_service_local_base_url || 'http://content-service:5000',
    sunbird_explore_button_visibility: env.sunbird_explore_button_visibility || 'true',
    sunbird_help_link_visibility: env.sunbird_help_link_visibility || 'true',
    sunbird_extcont_whitelisted_domains: env.sunbird_extcont_whitelisted_domains || 'youtube.com,youtu.be',
    sunbird_portal_user_upload_ref_link: env.sunbird_portal_user_upload_ref_link || 'http://www.sunbird.org/features-documentation/register_user',
    GOOGLE_OAUTH_CONFIG: {
      clientId: env.sunbird_google_oauth_clientId  || '671624305038-e8pbpmidst6lf0j5qplp6g6odan3lbf5.apps.googleusercontent.com' || '903729999899-7vcrph3vro36ot43j1od8u6he9jjend0.apps.googleusercontent.com',
      clientSecret: env.sunbird_google_oauth_clientSecret || 'mDO2MM68iW23f47ZFtvREld9' || 'BAEAYRv7voTByz5rOKkbIE3u' 
    },
    KEYCLOAK_GOOGLE_CLIENT: {
      clientId: env.sunbird_google_keycloak_client_id || 'google-auth',
      secret: env.sunbird_google_keycloak_secret || '8486df4b-2ec0-4249-92d8-5f3a7064cd07'
    },
    KEYCLOAK_GOOGLE_DESKTOP_CLIENT: {
      clientId: env.sunbird_google_oauth_clientId  || '671624305038-e8pbpmidst6lf0j5qplp6g6odan3lbf5.apps.googleusercontent.com' || '903729999899-7vcrph3vro36ot43j1od8u6he9jjend0.apps.googleusercontent.com',
      clientSecret: env.sunbird_google_oauth_clientSecret || 'mDO2MM68iW23f47ZFtvREld9' || 'BAEAYRv7voTByz5rOKkbIE3u' 
    },
    KEYCLOAK_TRAMPOLINE_DESKTOP_CLIENT: {
      clientId: env.sunbird_trampoline_android_keycloak_client_id,
        secret: env.sunbird_trampoline_android_keycloak_secret
    },
    // sunbird_google_captcha_site_key: env.sunbird_google_captcha_site_key || '6Ldcf4EUAAAAAMrKQSviNtEzMretoDgeAUxqJv7d',
    sunbird_azure_report_container_name: env.sunbird_azure_report_container_name || 'reports',
    sunbird_azure_account_name: env.sunbird_azure_account_name || 'sunbirddev',
    sunbird_azure_account_key: env.sunbird_azure_account_key || 'hVZeCECRUwsIZEL2h+GqF3bRo5Iz365G+zhrOZlYYYXBmrjuv4NyBv47xsmcvyQvAQPnnLG9r9iGil9TLgeyeA==',
    sunbird_portal_health_check_enabled: env.sunbird_health_check_enable || 'true',
    sunbird_learner_service_health_status: 'true',
    sunbird_google_captcha_site_key: '6Ldk3O8UAAAAAC2tm0qkPGbJC7YJVpVzMeIuhumb',
    google_captcha_private_key: '6Ldk3O8UAAAAADomyNFfGHh-bGf0_z6FzaHR4N35',
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
    sunbird_kid_public_key_base_path: env.sunbird_kid_public_key_base_path || '/keys/',
    Sunbird_bot_configured: 'true',
    Sunbird_bot_service_URL: '/chatapi/bot',
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
    }
  }
newStagingEnvVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '')
    ? env.sunbird_cassandra_urls.split(',') : ['localhost']

if (__envIn == 'dev') {
  module.exports = devEnvVariables
} else if (__envIn == 'staging') {
  module.exports = stagingEnvVariables
} else if (__envIn == 'preprod') {
  module.exports = preprodEnvVariables
} else if (__envIn == 'contributer') {
  module.exports = contributerEnvVariables
}else if (__envIn == 'newStaging') {
  module.exports = newStagingEnvVariables
}
// 