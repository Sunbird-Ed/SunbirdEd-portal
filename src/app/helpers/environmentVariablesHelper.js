'use strict'
const env = process.env
let envVariables = {
  LEARNER_URL: 'https://staging.open-sunbird.org/api/',
  CONTENT_URL: 'https://staging.open-sunbird.org/api/',
  CONTENT_PROXY_URL: 'https://staging.open-sunbird.org',
  PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
  PORTAL_AUTH_SERVER_URL: 'https://staging.open-sunbird.org/auth',
  PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',
  APPID: env.sunbird_appid || 'sunbird.portal',
  DEFAUULT_TENANT: env.sunbird_default_tenant || '',
  EKSTEP_ENV: env.ekstep_env || 'qa',
  PORTAL_PORT: env.sunbird_port || 3000,
  PORTAL_API_AUTH_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2NTU0NDQ5ZWI0MGQ0YTI4ODQ3YzAzYWZlNmJjMmEyOCJ9.YhnTaDw_xvf8Q5S66QiO71-5WeqLaTPv-vvNZSwBqLk',
  PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 20,
  PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || 'https://staging.open-sunbird.org/api/echo/',
  PORTAL_AUTOCREATE_TRAMPOLINE_USER: env.sunbird_autocreate_trampoline_user || 'true',
  PORTAL_TRAMPOLINE_CLIENT_ID: env.sunbird_trampoline_client_id || 'trampoline',
  PORTAL_TRAMPOLINE_SECRET: env.sunbird_trampoline_secret,
  ENABLE_PERMISSION_CHECK: env.sunbird_enabless_permission_check || 0,
  PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'in-memory',
  PORTAL_TITLE_NAME: env.sunbird_portal_title_name || 'Sunbird',
  PORTAL_CDN_URL: env.sunbird_cdn_url || '',
  PORTAL_THEME: env.sunbird_theme || 'default',
  PORTAL_DEFAULT_LANGUAGE: env.sunbird_portal_default_language || 'en',
  PORTAL_PRIMARY_BUNDLE_LANGUAGE: env.sunbird_portal_primary_bundle_language || 'en',
  CONTENT_SERVICE_UPSTREAM_URL: env.sunbird_content_service_upstream_url || 'http://localhost:5000/',
  LEARNER_SERVICE_UPSTREAM_URL: env.sunbird_learner_service_upstream_url || 'http://localhost:9000/',
  DATASERVICE_URL: env.sunbird_dataservice_url || 'https://staging.open-sunbird.org/api/',
  KEY_CLOAK_PUBLIC: env.sunbird_keycloak_public || 'true',
  KEY_CLOAK_REALM: env.sunbird_keycloak_realm || 'sunbird',
  CACHE_STORE: env.sunbird_cache_store || 'memory',
  CACHE_TTL: env.sunbird_cache_ttl || 1800
}
envVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '') ? env.sunbird_cassandra_urls.split(',') : ['localhost']
module.exports = envVariables