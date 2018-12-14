#!/bin/bash
set -euo pipefail

commit_hash=$1
org=sunbird
name=player
version=$2
node=$3

docker build -f ./Dockerfile.Build --build-arg commit_hash=${commit_hash} -t ${org}/${name}:${version}-build . 
docker run --name=${name}-${version}-build ${org}/${name}:${version}-build
containerid=$(docker ps -aqf "name=${name}-${version}-build")
rm -rf ./dist
docker cp $containerid:/opt/player/app/player-dist.tar.gz .
docker rm ${containerid}
docker build -f ./Dockerfile --label commitHash=$(git rev-parse --short HEAD) -t ${org}/${name}:${version}_${commit_hash} .
echo {\"imageName\" : \"${org}/${name}:${version}_${commit_hash}\", \"nodeName\" : \"$node\"} > metadata.json
