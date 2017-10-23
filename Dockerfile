FROM node:6-alpine
MAINTAINER "Manojvv" "manojrpms@gmail.com"
RUN apk update \
    && apk add unzip
RUN apk add --update \
    python \
    python-dev \
    py-pip \
  && pip install virtualenv \
  && rm -rf /var/cache/apk/*
RUN npm install --global azure-cli@0.10.1 \
    && azure --completion >> ~/azure.completion.sh \
    && echo 'source ~/azure.completion.sh' >> ~/.bashrc \
    && echo "1" >> input \
    && azure --version < input \
    && apk update
RUN adduser -u 1001 -h /home/sunbird/ -D sunbird
WORKDIR /home/sunbird
COPY player-dist.zip  /home/sunbird/
RUN unzip /home/sunbird/player-dist.zip \ 
    && chown -R sunbird:sunbird /home/sunbird
USER sunbird
EXPOSE 3000
COPY docker-entrypoint.sh /home/sunbird/docker-entrypoint.sh
ENTRYPOINT ["/home/sunbird/docker-entrypoint.sh"]
