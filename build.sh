#!/bin/bash
set -euo pipefail

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

build_tag=$1
name=player
node=$2
org=$3
export content_editor_url=$4
export collection_editor_url=$5
export generic_editor_url=$6
commit_hash=$(git rev-parse --short HEAD)

rm -rf src/app/app_dist/
rm -rf src/app/player-dist.tar.gz
nvm use 8
cd src/app
npm set progress=false
npm install  --unsafe-perm
npm run deploy
cd app_dist
npm i -g npm@3.10.10
npm install --production  --unsafe-perm
sed -i "/version/a\  \"buildHash\": \"8d1b8cf\","  package.json
echo 'Compressing assets directory'
cd ..
tar -cvf player-dist.tar.gz app_dist

docker build --build-arg commit_hash=$(git rev-parse --short HEAD) --build-arg content_editor_url=$content_editor_url --build-arg collection_editor_url=$collection_editor_url --build-arg generic_editor_url=$generic_editor_url --label commitHash=$(git rev-parse --short HEAD) -t ${org}/${name}:${build_tag} .

echo {\"image_name\" : \"${name}\", \"image_tag\" : \"${build_tag}\",\"commit_hash\" : \"${commit_hash}\", \"node_name\" : \"$node\"} > metadata.json

