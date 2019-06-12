#!/bin/bash
# Build script
# set -o errexit
set -x

chown -R jenkins /var/lib/jenkins
su jenkins
cd src/app
version=$(jq '.version' package.json | sed 's/\"//g')
cdnUrl=$1
build_hash=$2
artifact_version=$3
npm install
./node_modules/.bin/gulp download:editors
cd client
npm install
npm run build-cdn -- --deployUrl $cdnUrl
cd ..
export sunbird_portal_cdn_url=$cdnUrl
npm run inject-cdn-fallback
# Gzipping of assets
./node_modules/.bin/gulp gzip:editors client:gzip
mv dist/index.html dist/index.${version}.${build_hash}.ejs
chown -R jenkins ./
