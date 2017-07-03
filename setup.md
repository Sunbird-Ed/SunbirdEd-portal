# Player  Setup


## Environment Variables
1. sunbird_port
2. sunbird_content_player_url=http://{{content_service_ip}}:5000/api/sb/v1/
3. sunbird_learner_player_url=http://{{learner_service_ip}}:9000/v1/


## Pre Requirements

1. Node
2. gulp (npm install -g gulp)
3. bower (npm install -g bower)



## Setup Instructions


* Clone the project.
* Change to PROJECT_FOLDER
* RUN `npm install`
* RUN `bower install`
* RUN `gulp semantic`
* RUN `gulp`
* Change to dist
* Run `node server.js`




