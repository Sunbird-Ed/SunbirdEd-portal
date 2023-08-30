const env = process.env;
const SB_DOMAIN = 'https://staging.sunbirded.org';
let mandEnvVariables = {
    // Environment variables
    //mandatory
    KONG_DEVICE_REGISTER_AUTH_TOKEN: env.sunbird_kong_device_register_token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodEsyTUNWb1hNdjZPeFY0UE1RWnBia3MzNmlXY1d5aCJ9.oLpRBmf6u_2oqcrS3cxL9zr8pBQd62EtVORDOqvNfEU',
    // Device register API for anonymous users
    sunbird_anonymous_register_token: env.sunbird_anonymous_register_token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNZXI4RWplMW0yMFB5cXpISWljM2tUM3FraVZoWmZXRSJ9.3M23YKULRjFWW9NkbZQQgq1-_BaIVcsUh-Cr3PkHG54',
    // Fallback token for device register API for `anonymous` users
    sunbird_anonymous_default_token: env.sunbird_anonymous_default_token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3N21wRElZcEZuemZQaUsxZmdwaGpCZWVGdXF1T1RZMSJ9.v8nl17oKQ0sbQAfw1QEoXyY1fG2Ib4hRB0FyPrjYQp0',
    //Generalised cloud configuration // 
    cloud_private_storage_accountname: env.cloud_private_storage_accountname || 'azure',
    sunbird_cloud_storage_provider: env.sunbird_cloud_storage_provider || 'azure',
    cloud_private_storage_secret: env.cloud_private_storage_secret || 'private_storage_secret',

    // default value present
    sunbird_anonymous_session_ttl: env.sunbird_anonymous_session_ttl ? parseInt(env.sunbird_anonymous_session_ttl) : 10 * 60 * 1000,
    APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',
    sunbird_instance_name: env.sunbird_instance || 'Sunbird',
    DEFAULT_CHANNEL: env.sunbird_default_channel,
    PORTAL_SESSION_SECRET_KEY: (env.sunbird_portal_session_secret && env.sunbird_portal_session_secret !== '')
        ? env.sunbird_portal_session_secret.split(',') : 'sunbird,ed48b0ce-5a92-11ed-9b6a-0242ac120002'.split(','),

    // Application Start-up - Hosts and PORT Configuration
    PORTAL_PORT: env.sunbird_port || 3000,
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
module.exports = mandEnvVariables;