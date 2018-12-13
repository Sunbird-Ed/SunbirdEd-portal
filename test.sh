#!/bin/sh
echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
apt-get update
apt-get -y install libxpm4 libxrender1 libgtk2.0-0 libnss3 libgconf-2-4 \
xvfb gtk2-engines-pixbuf \
xfonts-cyrillic xfonts-100dpi xfonts-75dpi xfonts-base xfonts-scalable \
google-chrome-stable
cd src/app/client/
npm install @angular/cli
npm install
ng lint
ng build --prod
npm run test-coverage
