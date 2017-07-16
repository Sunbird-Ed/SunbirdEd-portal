FROM node:6-alpine
MAINTAINER "Manojvv" "manojrpms@gmail.com"
RUN apk update \
    && apk add unzip
RUN adduser -u 1001 -h /home/sunbird/ -D sunbird
WORKDIR /home/sunbird
COPY player-dist.zip  /home/sunbird/
RUN unzip /home/sunbird/player-dist.zip \ 
    && chown -R sunbird:sunbird /home/sunbird
WORKDIR /home/sunbird/dist
EXPOSE 3000
CMD ["node", "server.js", "&"]