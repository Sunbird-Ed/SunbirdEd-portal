#Player  Setup


##Environment Variables

1. sunbird_content_player_url
2. sunbird_learner_player_url
3. sunbird_port
4. sunbird_echo_api_url
5. sunbird_autocreate_trampoline_user eg: true (boolean value, default to true)
6. sunbird_telemetry_packet_size (number Eg: 20)
7. sunbird_mongodb_ip
8. sunbird_mongodb_port
9. sunbird_mongodb_ttl // (number Eg: 1)


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
* RUN `gulp semantic`
* RUN `gulp`
* Change to dist
* Run `node server.js`




