#!/bin/sh
npm install @angular/cl
cd src/app/client/
npm install
ng lint
ng build --prod
npm run test-coverage
