#!/bin/bash
set -euo pipefail

build_tag=$1
name=player
node=$2
org=$3
commit_hash=$(git rev-parse --short HEAD)

rm -rf src/app/app_dist/
rm -rf src/app/player-dist.tar.gz
nvm use 8
cd src/app
npm set progress=false
npm install  --unsafe-perm
npm run deploy
npm i -g npm@3.10.10
npm install --production  --unsafe-perm
sed -i "/version/a\  \"buildHash\": \"8d1b8cf\","  app_dist/package.json
echo 'Compressing assets directory'
tar -cvf player-dist.tar.gz app_dist
cd ../..

docker build --build-arg commit_hash=$(git rev-parse --short HEAD) --label commitHash=$(git rev-parse --short HEAD) -t ${org}/${name}:${build_tag} .
echo {\"image_name\" : \"${name}\", \"image_tag\" : \"${build_tag}\",\"commit_hash\" : \"${commit_hash}\", \"node_name\" : \"$node\"} > metadata.json
