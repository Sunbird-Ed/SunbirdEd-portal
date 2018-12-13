#!/bin/sh
npm install @angular/cli
cd src/app/client/
npm install
ng lint
ng build --prod
apk add chromium
export CHROME_BIN=/usr/bin/chromium-browser
npm run test-coverage
