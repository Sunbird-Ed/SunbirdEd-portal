#!/bin/bash
cd /offline/src/desktop
rm -rf app_dist
cd ../app/client
npm set progress=false
yarn install
npm run prod-desktop
cd ..
yarn install
npm run  resource-bundles
cd ../desktop/OpenRAP
yarn install
npm run pack
cd ..
yarn install
npm run build-ts
node scripts/copy.js
# Tar the generic build files
tar -czvf app_dist.tar.gz app_dist