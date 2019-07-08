#!/bin/bash
# Build script
# set -o errexit
set -x

#chown -R jenkins /var/lib/jenkins
#su jenkins
cd src/app/client
version=$(jq '.version' package.json | sed 's/\"//g')
cdnUrl=$1
build_hash=$2
artifact_version=$3
npm install
npm run build-cdn -- --deployUrl $cdnUrl
export sunbird_portal_cdn_url=$cdnUrl
npm run inject-cdn-fallback
#chown -R jenkins ./
