#!/bin/bash
STARTTIME=$(date +%s)
NODE_VERSION=14.19.0
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
echo "buildDockerImage: " $buildDockerImage
echo "buildCdnAssests: " $buildCdnAssests
if [ $buildCdnAssests == true ]
then
    cdnUrl=$6
    echo "cdnUrl: " $cdnUrl
fi

commit_hash=$(git rev-parse --short HEAD)
nvm install $NODE_VERSION # same is used in client and server

cd src/app
mkdir -p app_dist/ # this folder should be created prior server and client build
rm -rf dist-cdn # remove cdn dist folder

# function to run client build for docker image
build_client_docker(){
    echo "starting client local prod build"
    npm run build # Angular prod build
    echo "completed client local prod build"
    cd ..
    mv app_dist/dist/index.html app_dist/dist/index.ejs # rename index file
}
# function to run client build for cdn
build_client_cdn(){
    echo "starting client cdn prod build"
    npm run build-cdn -- --deployUrl $cdnUrl # prod command
    export sunbird_portal_cdn_url=$cdnUrl # required for inject-cdn-fallback task
    npm run inject-cdn-fallback
    echo "completed client cdn prod build"
}
# function to run client build
build_client(){
    echo "Building client in background"
    nvm use $NODE_VERSION
    cd client
    echo "starting client yarn install"
    yarn install --no-progress --production=true
    echo "completed client yarn install"
    if [ $buildDockerImage == true ]
    then
    build_client_docker & # run client local build in background 
    fi
    if [ $buildCdnAssests == true ]
    then
    build_client_cdn & # run client local build in background
    fi
    wait # wait for both build to complete
    echo "completed client post_build"
}

# function to run server build
build_server(){
    echo "Building server in background"
    echo "copying requied files to app_dist"
    cp -R libs helpers proxy resourcebundles package.json framework.config.js sunbird-plugins routes constants controllers server.js ./../../Dockerfile app_dist
    cd app_dist
    nvm use $NODE_VERSION
    echo "starting server yarn install"
    yarn install --no-progress --production=true
    echo "completed server yarn install"
    node helpers/resourceBundles/build.js -task="phraseAppPull"
}

build_client & # run client build in background 
if [ $buildDockerImage == true ]
then
   build_server & # run client build in background
fi

## wait for both build to complete
wait 

BUILD_ENDTIME=$(date +%s)
echo "Client and Server Build complete Took $[$BUILD_ENDTIME - $STARTTIME] seconds to complete."

if [ $buildDockerImage == true ]
then
cd app_dist
# you will need to inject the custom client-cloud-service bundle.js to the player build
# the actual file location will depends on your bundle.js location
#    1. build the custom client-cloud-services from https://github.com/ocisunbird/client-cloud-services/tree/oci-5.1.0
#         you can build it with jenkins or manually
#    2. put the build artifact, i.e. bundle.js somehere in your jenkins server
#    3. update the cp line below and copy the custom bundle.js to the player BEFORE docker build, e.g.
# 20230419 - fix key file problem, change to build 4
cp /var/lib/jenkins/jobs/Build/jobs/build-local/jobs/NodeJS-Client-Cloud-Service/builds/4/archive/dist/bundle.js   node_modules/client-cloud-services/dist/
sed -i "/version/a\  \"buildHash\": \"${commit_hash}\"," package.json
echo "starting docker build"
docker build --no-cache --label commitHash=$(git rev-parse --short HEAD) -t ${org}/${name}:${build_tag} .
echo "completed docker build"
cd ../../..
echo {\"image_name\" : \"${name}\", \"image_tag\" : \"${build_tag}\",\"commit_hash\" : \"${commit_hash}\", \"node_name\" : \"$node\"} > metadata.json
fi

ENDTIME=$(date +%s)
echo "build completed. Took $[$ENDTIME - $STARTTIME] seconds."
