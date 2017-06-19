FROM ubuntu:16.04
MAINTAINER "Manojvv" "manojrpms@gmail.com"
RUN apt-get update && apt-get install -y git \
  unzip \
  zip \
  build-essential \
  curl
RUN curl --silent --location https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get install --yes nodejs 
WORKDIR /opt/
COPY player-dist.zip  /opt/
RUN unzip /opt/player-dist.zip 
WORKDIR /opt/dist
RUN npm install express-http-proxy --save
RUN npm install express --save
RUN npm install request --save
EXPOSE 7000
CMD ["node", "server.js", "&"]
