#!/bin/bash
# Build script
# set -o errexit
set -euo pipefail

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm use 12.16.1
cd src/app/client
version=$(jq '.version' package.json | sed 's/\"//g')
cdnUrl=$1
build_hash=$2
npm install --production --unsafe-perm --prefer-offline --no-audit --progress=false
npm run build-cdn -- --deployUrl $cdnUrl
export sunbird_portal_cdn_url=$cdnUrl
npm run inject-cdn-fallback
