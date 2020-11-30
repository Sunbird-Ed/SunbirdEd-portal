#!/bin/bash 
rm -rf app_dist
cd ../app/client
npm set progress=false
npm install  -g yarn
yarn install
npm run prod-desktop
cd ..
yarn install
npm run  resource-bundles
cd ../desktop/OpenRAP
npm install  --unsafe-perm
npm run pack
cd ..
npm install  --unsafe-perm
npm run build-ts
node scripts/copy.js
