#!/bin/bash

mkdir -p /tmp/logs
cd src/app/client/

function build {
npm install -g @angular/cli
npm install
ng lint
ng build --prod
}

echo "Building codebase. If you want to see the complete build log, check artifacts"
build | tee /tmp/logs/build.log
npm run test-coverage | tee /tmp/logs/test_cases.log
