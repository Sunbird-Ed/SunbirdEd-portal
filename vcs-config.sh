#!/bin/bash

# Appending commit hash in package.json
echo adding commit hash to package.json
pwd
sed -i "/version/a\  \"commitHash\": \"${commit_hash}\"," app_dist/package.json
# Creating assets tar
tar -cvf player-dist_${commit_hash}.tar.gz app_dist
