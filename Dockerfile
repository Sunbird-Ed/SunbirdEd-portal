FROM mhart/alpine-node:6
MAINTAINER "Manojvv" "manojrpms@gmail.com"
RUN apk update \
    && apk add unzip
WORKDIR /opt/
COPY player-dist.zip  /opt/
RUN unzip /opt/player-dist.zip 
WORKDIR /opt/dist
RUN npm install express-http-proxy --save \
    && npm install express --save \
    && npm install request --save
EXPOSE 80
CMD ["node", "server.js", "&"]
