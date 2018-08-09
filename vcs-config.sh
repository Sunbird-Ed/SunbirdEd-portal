#!/bin/bash

# Appending commit hash in package.json
sed -i "/version/a\  \"commitHash\": \"${commit_hash}\"," package.json
# Creating assets tar
tar -cvf player-dist_${commit_hash}.tar.gz app_dist
