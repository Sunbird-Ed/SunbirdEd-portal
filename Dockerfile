#Dockerfile for the player setup
FROM circleci/node:8.11.2-stretch
MAINTAINER "Rajesh Rajendran <rajesh.r@optit.co>"
USER root
RUN mkdir -p /opt/player \
WORKDIR /opt/player
COPY * /opt/player/
WORKDIR /opt/player/app
RUN npm set progress=false
RUN npm install  --unsafe-perm 
RUN npm run deploy
WORKDIR /opt/player/app/app_dist
RUN npm i -g npm@3.10.10
RUN npm install --production  --unsafe-perm  
WORKDIR /opt/player/app
# passing commit hash as build arg
ARG commit_hash=0
ENV commit_hash ${commit_hash}
RUN /bin/bash -x ../vcs-config.sh

FROM node:8.11-slim
MAINTAINER "Rajesh R <rajesh.r@optit.co>"
RUN useradd -u 1001 -md /home/sunbird sunbird
WORKDIR /home/sunbird
COPY --from=0 /opt/player/app/app_dist/ /home/sunbird/app_dist/
RUN chown -R sunbird:sunbird /home/sunbird
USER sunbird
WORKDIR /home/sunbird/app_dist
# This is the short commit hash from which this image is built from
# This label is assigned at time of image creation
# LABEL commitHash
EXPOSE 3000
CMD ["node", "server.js", "&"]
