FROM node:6-alpine
MAINTAINER "Manojvv" "manojrpms@gmail.com"
RUN apk update \
    && apk add unzip
RUN apt-key adv --keyserver packages.microsoft.com --recv-keys 417A0893 \
    && apt-get update \
    && apt-get install apt-transport-https \
    && echo "deb https://packages.microsoft.com/repos/azure-cli/ wheezy main" | tee /etc/apt/sources.list.d/azure-cli.list \
    && apt-get update \
    && apt-get install azure-cli
RUN adduser -u 1001 -h /home/sunbird/ -D sunbird
WORKDIR /home/sunbird
COPY player-dist.zip  /home/sunbird/
RUN unzip /home/sunbird/player-dist.zip \ 
    && chown -R sunbird:sunbird /home/sunbird
USER sunbird
WORKDIR /home/sunbird/dist
EXPOSE 3000
COPY append.py /home/sunbird/dist
COPY docker-entrypoint.sh /home/sunbird/
ENTRYPOINT ["/home/sunbird/docker-entrypoint.sh"]
