#!/bin/bash

# Renaming index.ejs to index.<release-version>.<commit_hash>.ejs
echo 'Renaming index.ejs to index.<release-version>.<commit_hash>.ejs'
release=$(awk '/version/{print $2}' app_dist/package.json | cut -d'"' -f 2)
mv app_dist/dist/index.ejs app_dist/dist/index.${release}.${commit_hash}.ejs

# Appending commit hash in package.json
echo 'adding commit hash to package.json'
sed -i "/version/a\  \"commitHash\": \"${commit_hash}\"," app_dist/package.json

# Creating assets tar
echo 'Compressing assets directory'
tar -cvf player-dist_${commit_hash}.tar.gz app_dist
