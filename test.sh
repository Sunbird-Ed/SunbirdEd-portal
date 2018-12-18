#!/bin/bash

mkdir -p /tmp/logs
cd src/app/client/

function build {
npm install -g @angular/cli
npm install
ng lint
ng build --prod
}

build &> /tmp/logs/build.sh
npm run test-coverage | tee /tmp/logs/test_cases.log
