FROM mhart/alpine-node:6
MAINTAINER "Manojvv" "manojrpms@gmail.com"
RUN apk update 
RUN apk add -y git \
  unzip \
  zip \
  curl
WORKDIR /opt/
COPY player-dist.zip  /opt/
RUN unzip /opt/player-dist.zip 
WORKDIR /opt/dist
RUN npm install express-http-proxy --save
RUN npm install express --save
RUN npm install request --save
EXPOSE 80
CMD ["node", "server.js", "&"]
