#!/bin/bash
set -euo pipefail

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

build_tag=$1
name=player
node=$2
org=$3
export sunbird_content_editor_artifact_url=$4
export sunbird_collection_editor_artifact_url=$5
export sunbird_generic_editor_artifact_url=$6
export phrase_authToken=$7
export phrase_project=$8
export phrase_locale=$9
export phrase_fileformat=$10
export phrase_merge=$11
commit_hash=$(git rev-parse --short HEAD)

rm -rf src/app/app_dist/
rm -rf src/app/player-dist.tar.gz
nvm install 12.16.1
nvm use 12.16.1
cd src/app
npm set progress=false
npm install  --unsafe-perm
npm run deploy
cd app_dist
npm i -g npm@6.13.4
npm install --production  --unsafe-perm
sed -i "/version/a\  \"buildHash\": \"${commit_hash}\"," package.json
echo 'Compressing assets directory'
cd ..
tar -cvf player-dist.tar.gz app_dist
cd ../..

docker build --no-cache --label commitHash=$(git rev-parse --short HEAD) -t ${org}/${name}:${build_tag} .

echo {\"image_name\" : \"${name}\", \"image_tag\" : \"${build_tag}\",\"commit_hash\" : \"${commit_hash}\", \"node_name\" : \"$node\"} > metadata.json

