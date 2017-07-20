#Player  Setup


##Environment Variables

1. sunbird_content_player_url
2. sunbird_learner_player_url
3. sunbird_port
4. sunbird_echo_api_url - e.g.: https://dev.open-sunbird.org/api/echo/
5. sunbird_autocreate_trampoline_user eg: true (boolean value, default to true)
6. sunbird_telemetry_packet_size (number Eg: 20)
7. sunbird_mongodb_ip
8. sunbird_mongodb_port
9. sunbird_mongodb_ttl  (number Eg: 1)
10. sunbird_portal_realm (string Eg: "sunbird") 
11. sunbird_portal_auth_server_url (keycloak auth server url Eg: "https://dev.open-sunbird.org/auth")
12. sunbird_portal_auth_server_client (string Eg: "portal")
13. sunbird_trampoline_client_id (string Eg: "trampoline")
14. sunbird_trampoline_secret (string Eg: 36c4277f-d59b-4ea2-b788-964b96bd47d1)
15. sunbird_appid (string Eg. sunbird.portal or ntp.portal)
16. ekstep_env (string Eg. qa or prod)
17. sunbird_default_tenant (string Eg: ntp)

##Pre Requirements

1. Node
2. gulp (npm install -g gulp)
3. bower (npm install -g bower)
4. Mongo



##Setup Instructions


* Clone the project.
* Change to PROJECT_FOLDER
* RUN `npm install`
* RUN `bower cache clean`
* RUN `bower install --force`
* RUN `gulp`
* Change to dist
* Run `node server.js`




