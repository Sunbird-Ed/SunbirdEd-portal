#!/bin/sh

cd src/app/client/
npm install @angular/cli > /tmp/build.log
npm install > /tmp/build.log
ng lint > /tmp/build.log
ng build --prod > /tmp/build.log
npm run test-coverage | tee /tmp/test.log
