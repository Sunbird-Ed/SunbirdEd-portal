'use strict';
const env = process.env;

let envVariables = {
  LEARNER_URL: env.sunbird_learner_player_url || 'https://staging.open-sunbird.org/api/',
  CONTENT_URL: env.sunbird_content_player_url || 'https://staging.open-sunbird.org/api/',
  CONTENT_PROXY_URL: env.sunbird_content_proxy_url || 'https://staging.open-sunbird.org',
  PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
  PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || 'https://staging.open-sunbird.org/auth',
  PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || "portal",
  APPID: env.sunbird_appid || 'sunbird.portal',
  DEFAUULT_TENANT: env.sunbird_default_tenant,
  EKSTEP_ENV: env.ekstep_env || 'qa',
  PORTAL_PORT: env.sunbird_port || 3000,
  PORTAL_API_AUTH_TOKEN: env.sunbird_api_auth_token,
  PORTAL_MONGODB_IP: env.sunbird_mongodb_ip,
  PORTAL_MONGODB_PORT: env.sunbird_mongodb_port,
  PORTAL_MONGODB_TTL: env.sunbird_mongodb_ttl,
  PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 20,
  PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || 'https://staging.open-sunbird.org/api/echo/',
  PORTAL_AUTOCREATE_TRAMPOLINE_USER: env.sunbird_autocreate_trampoline_user || 'true',
  PORTAL_TRAMPOLINE_CLIENT_ID: env.sunbird_trampoline_client_id || 'trampoline',
  PORTAL_TRAMPOLINE_SECRET: env.sunbird_trampoline_secret,
  ENABLE_PERMISSION_CHECK: env.sunbird_enable_permission_check || 0
}

envVariables.PORTAL_CASSANDRA_URLS =  (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '') ? env.sunbird_cassandra_urls.split(",") : ["localhost"];

module.exports = envVariables;
