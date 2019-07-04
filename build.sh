#!/bin/bash
set -euo pipefail

build_tag=$1
name=player
node=$2
org=$3
content_editor_url=$4
collection_editor_url=$5
generic_editor_url=$6
commit_hash=$(git rev-parse --short HEAD)

docker build --build-arg commit_hash=$(git rev-parse --short HEAD) --build-arg content_editor_url=$content_editor_url --build-arg collection_editor_url=$collection_editor_url --build-arg generic_editor_url=$generic_editor_url --label commitHash=$(git rev-parse --short HEAD) -t ${org}/${name}:${build_tag} .
echo {\"image_name\" : \"${name}\", \"image_tag\" : \"${build_tag}\",\"commit_hash\" : \"${commit_hash}\", \"node_name\" : \"$node\"} > metadata.json
