#!/bin/bash
STARTTIME=$(date +%s)
export PYTHON=/usr/bin/python3.7
NODE_VERSION=18.20.2
echo "Starting portal build from build.sh"
set -euo pipefail	
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
build_tag=$1
name=player
node=$2
org=$3
buildDockerImage=$4
buildCdnAssests=$5
cdnUrl=""
echo "buildDockerImage: " $buildDockerImage
echo "buildCdnAssests: " $buildCdnAssests
## docker test start
if [ $buildCdnAssests == true ]
then
    cdnUrl=$6
    echo "cdnUrl: " $cdnUrl
fi

commit_hash=$(git rev-parse --short HEAD)
echo "starting docker build"
echo commit_hash $commit_hash
docker build --no-cache --build-arg buildCdnAssets=$buildCdnAssests --build-arg cdnUrl=$cdnUrl  --build-arg commit_hash=$(git rev-parse --short HEAD) -t ${org}/${name}:${build_tag} .

echo "completed docker build"
echo {\"image_name\" : \"${name}\", \"image_tag\" : \"${build_tag}\",\"commit_hash\" : \"${commit_hash}\", \"node_name\" : \"$node\"} > metadata.json

ENDTIME=$(date +%s)
echo "build completed. Took $[$ENDTIME - $STARTTIME] seconds."