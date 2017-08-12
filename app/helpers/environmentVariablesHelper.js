'use strict';
const env = process.env;

module.exports = {
  LEARNER_URL: env.sunbird_learner_player_url || 'https://dev.open-sunbird.org/api/',
  CONTENT_URL: env.sunbird_content_player_url || 'https://dev.open-sunbird.org/api/',
  CONTENT_PROXY_URL: env.sunbird_content_proxy_url || 'https://dev.open-sunbird.org/',
  PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
  PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || 'https://dev.open-sunbird.org/auth',
  PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || "portal",
  APPID: env.sunbird_appid || 'sunbird.portal',
  DEFAUULT_TENANT: env.sunbird_default_tenant,
  EKSTEP_ENV: env.ekstep_env || 'qa',
  PORTAL_PORT: env.sunbird_port || 3000,
  PORTAL_API_AUTH_TOKEN: env.sunbird_api_auth_token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkMTc1MDI' +
    'wNDdlODc0ODZjOTM0ZDQ1ODdlYTQ4MmM3MyJ9.7LWocwCn5rrCScFQYOne8_Op2EOo-xTCK5JCFarHKSs',
  PORTAL_MONGODB_IP: env.sunbird_mongodb_ip,
  PORTAL_MONGODB_PORT: env.sunbird_mongodb_port,
  PORTAL_MONGODB_TTL: env.sunbird_mongodb_ttl,
  PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 20,
  PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || 'https://dev.open-sunbird.org/api/echo/',
  PORTAL_AUTOCREATE_TRAMPOLINE_USER: env.sunbird_autocreate_trampoline_user || 'true',
  PORTAL_TRAMPOLINE_CLIENT_ID: env.sunbird_trampoline_client_id || 'trampoline',
  PORTAL_TRAMPOLINE_SECRET: env.sunbird_trampoline_secret || '36c4277f-d59b-4ea2-b788-964b96bd47d1'
}
