#!/bin/sh

cd src/app/client/
mkdir -p /tmp/logs
npm install @angular/cli > /tmp/logs/build.log
npm install > /tmp/logs/build.log
npm install ng > /tmp/logs/build.log
ng lint > /tmp/logs/build.log
ng build --prod > /tmp/logs/build.log
npm run test-coverage | tee /tmp/logs/test_cases.log
