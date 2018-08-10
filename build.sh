#!/bin/sh
# Build script
# set -o errexit
e () {
    echo $( echo ${1} | jq ".${2}" | sed 's/\"//g')
}
m=$(./src/app/metadata.sh)

org=$(e "${m}" "org")
name=$(e "${m}" "name")
version=$(e "${m}" "version")

docker build -f ./Dockerfile.Build -t ${org}/${name}:${version}-build . 
docker run --name=${name}-${version}-build ${org}/${name}:${version}-build
containerid=$(docker ps -aqf "name=${name}-${version}-build")
rm -rf ./dist
docker cp $containerid:/opt/player/app/player-dist.tar.gz player-dist_$(git rev-parse --short HEAD).tar.gz
# creating backup of current build, as Dockerfile can't incldue dynamic files
cp player-dist_$(git rev-parse --short HEAD).tar.gz player-dist.tar.gz
docker rm ${containerid}
docker build -f ./Dockerfile --label vcs-ref=$(git rev-parse --short HEAD) -t ${org}/${name}:${version}-bronze .
