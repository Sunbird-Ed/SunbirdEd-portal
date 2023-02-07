#!/bin/bash
cd /offline/src/desktop
rm -rf app_dist
cd ../app/client
yarn install
npm run prod-desktop
cd ..
yarn install
npm run  resource-bundles
cd ../desktop/OpenRAP
yarn install
npm run pack
cd ..
yarn --update-checksums
yarn install
npm run build-ts
npm install fs-extra@8.1.0 --save
node scripts/copy.js

# Tar the generic build files
tar -czvf app_dist.tar.gz app_dist
