#!bin/sh
set -e
cd /home/sunbird/dist
az storage container create  --name $CONTAINER_NAME
az storage blob upload --name cdn --file /home/sunbird/dist/cdn --container-name $CONTAINER_NAME
python append.py ${sunbird_cdn_url}/ /home/sunbird/dist/private/index.ejs
python append.py ${sunbird_cdn_url}/ /home/sunbird/dist/public/index.ejs
node server.js &

