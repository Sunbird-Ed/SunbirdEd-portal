#!/bin/sh
npm install @angular/cl
cd src/app/client/
npm install
ng lint
ng build --prod
# install manually all the missing libraries
apk install -y gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libxss1 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils

# install chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
dpkg -i google-chrome-stable_current_amd64.deb; apk -fy install
ENV CHROME_BIN=/usr/bin/google-chrome
npm run test-coverage
