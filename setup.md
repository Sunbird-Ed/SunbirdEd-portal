# Player  Setup

## Environment Variables
1. sunbird_content_player_url
2. sunbird_learner_player_url
3. sunbird_port
4. sunbird_echo_api_url - e.g.: https://dev.open-sunbird.org/api/echo/
5. sunbird_autocreate_trampoline_user eg: true (boolean value, default to true)
6. sunbird_telemetry_packet_size (number Eg: 20)
7. sunbird_portal_realm (string Eg: "sunbird") 
8. sunbird_portal_auth_server_url (keycloak auth server url Eg: "https://dev.open-sunbird.org/auth")
9. sunbird_portal_auth_server_client (string Eg: "portal")
10. sunbird_trampoline_client_id (string Eg: "trampoline")
11. sunbird_trampoline_secret (string Eg: 36c4277f-d59b-4ea2-b788-964b96bd47d1)
12. sunbird_appid (string Eg. sunbird.portal or ntp.portal)
13. ekstep_env (string Eg. qa or prod)
14. sunbird_default_tenant (string Eg: ntp)
15. sunbird_api_auth_token (string Token to call learner apis)
16. sunbird_cassandra_urls (String coma seperated values Eg: "locahost:3000,locahost:5000")

## Pre Requirements

1. [Node](https://nodejs.org/en/download/) v6.11.3 
2. [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) (npm install -g gulp)
3. [bower](https://bower.io/) (npm install -g bower)
4. [Cassandra](http://cassandra.apache.org/download/)

## Setup Instructions
* Clone the project.
* Change to src folder
* RUN `npm install`
* RUN `bower cache clean`
* RUN `bower install --force`
* RUN `gulp`
* Change to dist
* Run `node server.js`




