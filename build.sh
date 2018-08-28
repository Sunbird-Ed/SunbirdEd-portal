#!/bin/sh
# Build script
# set -o errexit
e () {
    echo $( echo ${1} | jq ".${2}" | sed 's/\"//g')
}
m=$(./src/app/metadata.sh)
commit_hash=$1

org=$(e "${m}" "org")
name=$(e "${m}" "name")
version=$(e "${m}" "version")

docker build -f ./Dockerfile.Build --build-arg commit_hash=${commit_hash} -t ${org}/${name}:${version}-build . 
docker run --name=${name}-${version}-build ${org}/${name}:${version}-build
containerid=$(docker ps -aqf "name=${name}-${version}-build")
rm -rf ./dist
docker cp $containerid:/opt/player/app/player-dist.tar.gz .
docker rm ${containerid}
docker build -f ./Dockerfile --label commitHash=$(git rev-parse --short HEAD) -t ${org}/${name}:${version}-bronze .
