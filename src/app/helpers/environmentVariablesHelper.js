'use strict'
const env = process.env
const fs = require('fs')
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const SB_DOMAIN = 'https://staging.open-sunbird.org'

let envVariables = {

    // Environment variables
    APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
    sunbird_instance_name: env.sunbird_instance || 'Sunbird',
    DEFAULT_CHANNEL: env.sunbird_default_channel,
    DEFAULT_BOARD: env.sunbird_default_board || 'CBSE',
    PORTAL_API_WHITELIST_CHECK: env.sunbird_enable_api_whitelist || 'true',
    PORTAL_SESSION_SECRET_KEY: (env.sunbird_portal_session_secret && env.sunbird_portal_session_secret !== '')
        ? env.sunbird_portal_session_secret.split(',') : 'sunbird,ed48b0ce-5a92-11ed-9b6a-0242ac120002'.split(','),

    // discussion forum
    discussions_middleware: env.discussions_middleware || 'http://discussionsmw-service:3002',
    uci_service_base_url: env.uci_service_base_url || "http://kong:8000",

    // Application Start-up - Hosts and PORT Configuration
    PORTAL_PORT: env.sunbird_port || 3000,
    LEARNER_URL: env.sunbird_learner_player_url || SB_DOMAIN + '/api/',
    CONTENT_URL: env.sunbird_content_player_url || SB_DOMAIN + '/api/',
    CONTENT_PROXY_URL: env.sunbird_content_proxy_url || SB_DOMAIN,
    PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
    PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || SB_DOMAIN + '/auth',
    PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',
    PORTAL_API_AUTH_TOKEN: env.sunbird_api_auth_token,
    PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || SB_DOMAIN + '/api/echo/',
    CONFIG_URL: env.sunbird_config_service_url || SB_DOMAIN + '/api/config/',
    EKSTEP_ENV: env.ekstep_env || 'qa',
    DEVICE_REGISTER_API: process.env.sunbird_device_register_api || 'https://api.open-sunbird.org/v3/device/register/',
    DEVICE_PROFILE_API: process.env.sunbird_device_profile_api || SB_DOMAIN + '/api/v3/device/profile/',
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
    CRYPTO_ENCRYPTION_KEY_EXTERNAL: env.crypto_encryption_key_external || '030702me8696b8ee2aa71x9n13l4251e',
    LOG_FINGERPRINT_DETAILS: env.sunbird_log_fingerprint_details || 'true',
    REPORT_SERVICE_URL: env.sunbird_report_service_url || SB_DOMAIN + '/api/data/v1/report-service',
    SUNBIRD_PORTAL_BASE_URL: env.sunbird_portal_base_url,
    sunbird_device_api: env.sunbird_device_api || 'https://staging.ntp.net.in/api/',
    sunbird_portal_slugForProminentFilter: env.sunbird_portal_slugForProminentFilter,
    sunbird_super_admin_slug: env.sunbird_super_admin_slug || 'sunbird',
    sunbird_kid_public_key_base_path: env.sunbird_kid_public_key_base_path || '/keys/',
    reportsListVersion: env.reportsListVersion || 'v1',
    sunbird_data_product_service: env.sunbird_data_product_service || 'https://staging.ntp.net.in/',
    ML_SERVICE_BASE_URL: env.ml_survey_url || 'https://survey.preprod.ntp.net.in/staging',
    SUNBIRD_PROTO: env.sunbird_base_proto,

    // TTL and Intervals
    CONFIG_REFRESH_INTERVAL: env.config_refresh_interval || 10,
    PORTAL_API_CACHE_TTL: env.sunbird_api_response_cache_ttl || '600',
    CACHE_TTL: env.sunbird_cache_ttl || 1800,
    RESPONSE_CACHE_TTL: env.sunbird_response_cache_ttl || '180', // used in tenant helper to cache the tenant response info
    sunbird_portal_updateLoginTimeEnabled: env.sunbird_portal_updateLoginTimeEnabled || false,
    sunbird_api_request_timeout: env.sunbird_api_request_timeout ? parseInt(env.sunbird_api_request_timeout) : 60 * 1000,
    sunbird_session_ttl: env.sunbird_session_ttl ? parseInt(env.sunbird_session_ttl) : 24 * 60 * 60 * 1000,

    // Telemetry Configuration
    PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 1000,
    TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'http://telemetry-service:9001/',

    // generic editor content size 150 MB
    SUNBIRD_DEFAULT_FILE_SIZE: env.sunbird_default_file_size || 150,

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
    KEYCLOAK_GOOGLE_IOS_CLIENT: {
        clientId: env.sunbird_google_oauth_ios_clientId,
        secret: env.sunbird_trampoline_desktop_keycloak_secret
    },

    PORTAL_TRAMPOLINE_CLIENT_ID: env.sunbird_trampoline_client_id || 'trampoline',
    PORTAL_TRAMPOLINE_SECRET: env.sunbird_trampoline_secret,
    PORTAL_AUTOCREATE_TRAMPOLINE_USER: env.sunbird_autocreate_trampoline_user || 'true',
    PORTAL_MERGE_AUTH_SERVER_URL: env.sunbird_portal_merge_auth_server_url || 'https://merge.staging.open-sunbird.org/auth',
    KEY_CLOAK_PUBLIC_KEY: env.sunbird_keycloak_public_key,

    // Social login Configuration
    GOOGLE_OAUTH_CONFIG: {
        clientId: env.sunbird_google_oauth_clientId,
        clientSecret: env.sunbird_google_oauth_clientSecret
    },
    GOOGLE_OAUTH_CONFIG_IOS: {
        clientId: env.sunbird_google_oauth_ios_clientId,
        clientSecret: env.sunbird_google_oauth_ios_clientSecret
    },
    sunbird_google_captcha_site_key: env.sunbird_google_captcha_site_key,
    google_captcha_private_key: env.google_captcha_private_key,
    sunbird_p1_reCaptcha_enabled: env.sunbird_p1_reCaptcha_enabled,
    sunbird_p2_reCaptcha_enabled: env.sunbird_p2_reCaptcha_enabled,
    sunbird_p3_reCaptcha_enabled: env.sunbird_p3_reCaptcha_enabled,

    // Android Configuration
    ANDROID_APP_URL: env.sunbird_android_app_url || 'http://www.sunbird.org',


    // BLOB and Storage Configuration
    CACHE_STORE: env.sunbird_cache_store || 'memory',
    sunbird_cloud_storage_provider: env.sunbird_cloud_storage_provider || 'azure',
    PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'in-memory',
    CLOUD_STORAGE_URLS: env.sunbird_cloud_storage_urls,
    SUNBIRD_PUBLIC_STORAGE_ACCOUNT_NAME: env.sunbird_azure_storage_account_name,
    PORTAL_CASSANDRA_CONSISTENCY_LEVEL: env.sunbird_cassandra_consistency_level || 'one',
    PORTAL_CASSANDRA_REPLICATION_STRATEGY: env.sunbird_cassandra_replication_strategy || '{"class":"SimpleStrategy","replication_factor":1}',

    // ############# CSP Configuration #############
    // Common key for Uploading Desktop Crash logs
    desktop_azure_crash_container_name: env.cloud_storage_desktopCrash_bucketname || 'desktopappcrashlogs',

    // Azure
    sunbird_azure_account_name: env.cloud_private_storage_accountname,
    sunbird_azure_account_key: env.cloud_private_storage_secret,
    sunbird_azure_report_container_name: env.cloud_storage_privatereports_bucketname || 'reports',
    sunbird_azure_resourceBundle_container_name: env.cloud_storage_resourceBundle_bucketname || 'label',

    // AWS
    sunbird_aws_access_key: env.cloud_private_storage_accountname || '',
    sunbird_aws_secret_key: env.cloud_private_storage_secret || '',
    sunbird_aws_region: env.cloud_private_storage_region || '',
    sunbird_aws_reports: env.cloud_storage_privatereports_bucketname || 'reports',
    sunbird_aws_labels: env.cloud_storage_resourceBundle_bucketname || 'label',

  // deprecated - Folder structure changed
  // sunbird_aws_bucket_name: env.sunbird_aws_bucket_name || 'sunbirded',

    // GCP - gcloud
    sunbird_gcloud_client_email: env.cloud_private_storage_accountname || '',
    sunbird_gcloud_private_key: env.cloud_private_storage_secret || '',
    sunbird_gcloud_projectId: env.cloud_private_storage_project || '',
    sunbird_gcloud_reports: env.cloud_storage_privatereports_bucketname || 'reports',
    sunbird_gcloud_labels: env.cloud_storage_resourceBundle_bucketname || 'label',

  // deprecated - Folder structure changed
  // sunbird_gcloud_bucket_name: env.sunbird_gcloud_bucket_name || 'sunbirded',

  // ############# End of CSP Configuration #############

    sunbird_portal_cdn_blob_url: env.sunbird_portal_cdn_blob_url || '',
    sunbird_portal_video_max_size: env.sunbird_portal_video_max_size || '50',

    // generic editor question set and coleections children contents limit
    SUNBIRD_QUESTIONSET_CHILDREN_LIMIT: env.sunbird_questionset_children_limit || 500,
    SUNBIRD_COLLECTION_CHILDREN_LIMIT: env.sunbird_collection_children_limit || 1200,

    // Default Language Configuration
    sunbird_default_language: env.sunbird_portal_default_language || 'en',
    sunbird_primary_bundle_language: env.sunbird_portal_primary_bundle_language || 'en',


    // Service(s) Base URL(s)
    learner_Service_Local_BaseUrl: env.sunbird_learner_service_local_base_url || 'http://learner-service:9000',
    content_Service_Local_BaseUrl: env.sunbird_content_service_local_base_url || 'http://content-service:5000',
    CONTENT_SERVICE_UPSTREAM_URL: env.sunbird_content_service_upstream_url || 'http://localhost:5000/',
    LEARNER_SERVICE_UPSTREAM_URL: env.sunbird_learner_service_upstream_url || 'http://localhost:9000/',
    DATASERVICE_URL: env.sunbird_dataservice_url || SB_DOMAIN + '/api/',
    PORTAL_EXT_PLUGIN_URL: process.env.sunbird_ext_plugin_url || 'http://player_player:3000/plugin/',
    sunbird_data_product_service: env.sunbird_data_product_service || 'https://staging.ntp.net.in/',


    // Health Checks Configuration
    sunbird_portal_health_check_enabled: env.sunbird_health_check_enable || 'true',
    sunbird_learner_service_health_status: 'true',
    sunbird_content_service_health_status: 'true',
    sunbird_portal_cassandra_db_health_status: 'true',


    // Bot configuration
    sunbird_bot_configured: env.sunbird_bot_configured,
    sunbird_bot_service_URL: env.sunbird_bot_service_URL,


    // Desktop App Configuration
    sunbird_portal_offline_tenant: env.sunbird_portal_offline_tenant,
    sunbird_portal_offline_supported_languages: env.sunbird_portal_offline_supported_languages || 'English, Assamese, Bengali, Gujarati, Hindi, Kannada, Malayalam, Marathi, Oriya, Punjabi, Tamil, Telugu, Urdu',
    sunbird_portal_offline_app_release_date: env.sunbird_portal_offline_app_release_date,
    sunbird_portal_offline_app_version: env.sunbird_portal_offline_app_version,
    sunbird_portal_offline_app_download_url: env.sunbird_portal_offline_app_download_url,
    DESKTOP_APP_STORAGE_URL: env.desktop_app_storage_url,
    DESKTOP_APP_ID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.desktop',


    // CDN Configuration
    PORTAL_CDN_URL: env.sunbird_portal_cdn_url || '',
    TENANT_CDN_URL: env.sunbird_tenant_cdn_url || '',
    sunbird_portal_preview_cdn_url: env.sunbird_portal_preview_cdn_url,


    // Kafka Configuration
    sunbird_processing_kafka_host: process.env.sunbird_processing_kafka_host,
    sunbird_sso_kafka_topic: process.env.sunbird_sso_kafka_topic,

    // Editors URLs
    CONTENT_EDITORS_URL: {
        COLLECTION_EDITOR: env.sunbird_collectionEditorURL || '',
        CONTENT_EDITOR: env.sunbird_contentEditorURL || '',
        GENERIC_EDITOR: env.sunbird_genericEditorURL || ''
    },

    // PhraseApp configuration
    PHRASE_APP: {
        phrase_authToken: env.sunbird_phraseApp_token || '',
        phrase_project: env.phrase_project || 'DIKSHA Portal,Sunbird Creation',
        phrase_locale: env.phrase_locale || ['en-IN', 'bn-IN', 'hi-IN', 'kn-IN', 'mr-IN', 'ur-IN', 'te-IN', 'ta-IN'],
        phrase_fileformat: env.phrase_fileformat || 'json'
    },
    // Temporary Variable
    sunbird_enable_sso: env.sunbird_enable_sso,

    //ML URLs
    ML_URL: {
        OBSERVATION_URL: ''
    },

    // Kong device registration and refresh token keys
    KONG_DEVICE_REGISTER_TOKEN: env.sunbird_kong_device_register || 'false',
    KONG_DEVICE_REGISTER_ANONYMOUS_TOKEN: env.sunbird_kong_device_register_anonymous || 'false',
    KONG_DEVICE_REGISTER_AUTH_TOKEN: env.sunbird_kong_device_register_token,
    sunbird_anonymous_session_ttl: env.sunbird_anonymous_session_ttl ? parseInt(env.sunbird_anonymous_session_ttl) : 10 * 60 * 1000,
    sunbird_default_device_token: env.sunbird_default_device_token || '',
    // Kong endpoints
    sunbird_anonymous_device_register_api: env.sunbird_anonymous_device_register_api || '',
    sunbird_loggedin_device_register_api: env.sunbird_loggedin_device_register_api || '',
    sunbird_kong_refresh_token_api: env.sunbird_kong_refresh_token_api || '',

    // Device register API for anonymous users
    sunbird_anonymous_register_token: env.sunbird_anonymous_register_token || '',
    // Device register API for logged in users
    sunbird_loggedin_register_token: env.sunbird_loggedin_register_token || '',

    // Fallback token for device register API for `anonymous` users
    sunbird_anonymous_default_token: env.sunbird_anonymous_default_token || '',
    // Fallback token for device register API for `logged` users
    sunbird_logged_default_token: env.sunbird_logged_default_token || '',

    // Redis storage
    PORTAL_REDIS_URL: env.sunbird_redis_urls,
    PORTAL_REDIS_PORT: env.sunbird_redis_port,
    PORTAL_REDIS_TYPE: env.sunbird_redis_type,
    PORTAL_REDIS_PASSWORD: env.sunbird_redis_password,
    PORTAL_REDIS_CONNECTION_STRING: env.portal_redis_connection_string,
  // VDN URL
    vdnURL: env.vdnURL || '',

    // Add below variable for Apple Login
    APPLE_SIGNIN_KEY_URL: "https://appleid.apple.com/auth/keys",

  //Redirect and ErrorCallback domain
    REDIRECT_ERROR_CALLBACK_DOMAIN: env.portal_redirect_error_callback_domain || '',

    // UCI
    sunbird_portal_uci_bot_phone_number: env.sunbird_portal_uci_bot_phone_number || '',

    // Accessibility links (from NAV) configuration
    sunbird_portal_nav_accessibility: env.sunbird_portal_nav_accessibility || 'true',
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