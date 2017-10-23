#!bin/sh
set -e
cd /home/sunbird/dist
if [ ! -d cdn ];then
    nohup node server.js &
    exit 0
fi
azure storage container create $CONTAINER_NAME -p Blob || true
azure storage container set -p Blob $CONTAINER_NAME
find cdn -type f -exec azure storage blob upload {} $CONTAINER_NAME  {} \;
python append.py ${sunbird_cdn_url}/ /home/sunbird/dist/private/index.ejs
python append.py ${sunbird_cdn_url}/ /home/sunbird/dist/public/index.ejs
nohup node server.js &