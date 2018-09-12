#!/bin/bash

# Appending commit hash in package.json
echo 'adding commit hash to package.json'
sed -i "/version/a\  \"buildHash\": \"${commit_hash}\"," app_dist/package.json

# Creating assets tar
echo 'Compressing assets directory'
tar -cvf player-dist.tar.gz app_dist