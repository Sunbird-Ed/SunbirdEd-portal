#!/bin/sh
echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
apt-get update
apt-get -y install libxpm4 libxrender1 libgtk2.0-0 libnss3 libgconf-2-4
apt-get -y install xvfb gtk2-engines-pixbuf
apt-get -y install xfonts-cyrillic xfonts-100dpi xfonts-75dpi xfonts-base xfonts-scalable
apt-get -y install google-chrome-stable

npm install @angular/cli
cd src/app/client/
npm install
ng lint
ng build --prod
#export CHROME_BIN=/usr/bin/chromium-browser
npm run test-coverage
