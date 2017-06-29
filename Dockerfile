FROM mhart/alpine-node:6
MAINTAINER "Manojvv" "manojrpms@gmail.com"
RUN apk update \
    && apk add unzip
RUN useradd -ms /bin/bash sunbird
USER sunbird
WORKDIR /home/sunbird
COPY player-dist.zip  /home/sunbird/
RUN unzip /home/sunbird/player-dist.zip 
WORKDIR /home/sunbird/dist
RUN npm install express-http-proxy --save \
    && npm install express --save \
    && npm install request --save
EXPOSE 80
CMD ["node", "server.js", "&"]
