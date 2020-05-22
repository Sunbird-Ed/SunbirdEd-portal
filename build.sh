#!/bin/bash
STARTTIME=$(date +%s)
echo "Starting portal build from build.sh"
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
buildDockerImage=$7
buildCdnAssests=$8
echo "buildDockerImage: " $buildDockerImage
echo "buildCdnAssests: " $buildCdnAssests
if [ $buildCdnAssests == true ]
then
    cdnUrl=$9
    echo "cdnUrl: " $cdnUrl
fi

commit_hash=$(git rev-parse --short HEAD)
nvm install 12.16.1 # same is used in client and server

cd src/app
mkdir -p app_dist/ # this folder should be created prior server and client build
rm -rf app_dist/dist # remove only dist folder rest else will be replaced by copy command

# function to run client build for docker image
build_client_docker(){
    npm run download-editors # download editors to assests folder
    echo "starting client local prod build"
    npm run build # Angular prod build
    echo "completed client local prod build"
    # npm run post-build # gzip files commenting this as this can be achived at proxy
    cd ..
    mv dist/index.html dist/index.ejs # rename index file
    echo "Copying Client dist to app_dist"
    cp -R dist app_dist
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
    nvm use 12.16.1
    cd client
    echo "starting client npm install"
    # npm install --production --unsafe-perm --prefer-offline --no-audit --progress=false
    yarn install --no-progress --production=true
    echo "completed client npm install"
    if [ $buildDockerImage == true ]
    then
    build_client_docker & # Put client local build in background 
    fi
    if [ $buildCdnAssests == true ]
    then
    build_client_cdn & # Put client local build in background
    fi
    wait # wait for both build to complete
    echo "completed client post_build"
}

# function to run server build
build_server(){
    echo "Building server in background"
    echo "copying requied files to app_dist"
    cp -R libs helpers proxy resourcebundles package.json framework.config.js package-lock.json sunbird-plugins routes constants controllers server.js ./../../Dockerfile app_dist
    cd app_dist
    nvm use 12.16.1
    echo "starting server npm install"
    # npm i -g npm@6.13.4
    # npm install --production --unsafe-perm --prefer-offline --no-audit --progress=false
    yarn install --no-progress --production=true
    echo "completed server npm install"
    node helpers/resourceBundles/build.js
}

build_client & # Put client build in background 
if [ $buildDockerImage == true ]
then
   build_server & # Put client build in background
fi

## wait for both build to complete
wait 

BUILD_ENDTIME=$(date +%s)
echo "Client and Server Build complete Took $[$BUILD_ENDTIME - $STARTTIME] seconds to complete."

if [ $buildDockerImage == true ]
then
cd app_dist
sed -i "/version/a\  \"buildHash\": \"${commit_hash}\"," package.json
echo "starting docker build"
docker build --no-cache --label commitHash=$(git rev-parse --short HEAD) -t ${org}/${name}:${build_tag} .
echo "completed docker build"
cd ../../..
echo {\"image_name\" : \"${name}\", \"image_tag\" : \"${build_tag}\",\"commit_hash\" : \"${commit_hash}\", \"node_name\" : \"$node\"} > metadata.json
fi

ENDTIME=$(date +%s)
echo "build completed. Took $[$ENDTIME - $STARTTIME] seconds."
