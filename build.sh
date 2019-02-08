#!/bin/bash
set -euo pipefail

build_tag=$1
name=player
node=$2
org=$3

docker build -f ./Dockerfile.Build --build-arg commit_hash=$(git rev-parse --short HEAD) -t ${org}/${name}:${build_tag}-build . 
docker run --name=${name}-${build_tag}-build ${org}/${name}:${build_tag}-build
containerid=$(docker ps -aqf "name=${name}-${build_tag}-build")
rm -rf ./dist
docker cp $containerid:/opt/player/app/player-dist.tar.gz .
docker rm ${containerid}
docker build -f ./Dockerfile --label commitHash=$(git rev-parse --short HEAD) -t ${org}/${name}:${build_tag} .
echo {\"image_name\" : \"${name}\", \"image_tag\" : \"${build_tag}\", \"node_name\" : \"$node\"} > metadata.json
