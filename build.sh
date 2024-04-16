#!/bin/bash
STARTTIME=$(date +%s)
export PYTHON=/usr/bin/python3.7
NODE_VERSION=18.20.2
echo "Starting portal build from build.sh"
set -euo pipefail	
export NVM_DIR="$HOME.nvm"
echo $NVM_DIR
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
# nvm install $NODE_VERSION # same is used in client and server
sudo -i

# Start by installing Node 20:

sudo apt-get install python3 g++ make python3-pip gcc bison

curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
bash n 18.20.2

# Node 18.20.2 is now at /usr/local/bin/node, but glibc 2.28 is missing:
# node: /lib/aarch64-linux-gnu/libc.so.6: version `GLIBC_2.28' not found (required by node)
# /usr/local/bin/node: /lib/aarch64-linux-gnu/libc.so.6: version `GLIBC_2.28' not found (required by /usr/local/bin/node)

# Build and install glibc 2.28:
apt install -y gawk
cd ~
wget -c https://ftp.gnu.org/gnu/glibc/glibc-2.28.tar.gz
tar -zxf glibc-2.28.tar.gz
cd glibc-2.28
pwd
mkdir glibc-build
cd glibc-build
../configure --prefix=/opt/glibc-2.28
make -j 4 # Use all 4 Jetson Nano cores for much faster building
make install
cd ..
rm -fr glibc-2.28 glibc-2.28.tar.gz
 
# Patch the installed Node 18.20.2 to work with /opt/glibc-2.28 instead: 
apt install -y patchelf
patchelf --set-interpreter /opt/glibc-2.28/lib/ld-linux-x86-64.so.2 --set-rpath /opt/glibc-2.28/lib/:/lib/x86_64-linux-gnu/:/usr/lib/x86_64-linux-gnu/ /usr/local/bin/node

# Et voilà:
node --version

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
    yarn install --ignore-engines --no-progress --production=true
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
sed -i "/version/a\  \"buildHash\": \"${commit_hash}\"," package.json
echo "starting docker build"
docker build --no-cache --label commitHash=$(git rev-parse --short HEAD) -t ${org}/${name}:${build_tag} .
echo "completed docker build"
cd ../../..
echo {\"image_name\" : \"${name}\", \"image_tag\" : \"${build_tag}\",\"commit_hash\" : \"${commit_hash}\", \"node_name\" : \"$node\"} > metadata.json
fi

ENDTIME=$(date +%s)
echo "build completed. Took $[$ENDTIME - $STARTTIME] seconds."