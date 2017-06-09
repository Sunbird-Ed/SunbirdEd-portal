#Dockerfile for the player setup
FROM ubuntu:16.04
MAINTAINER "Manojvv" "manojrpms@gmail.com"
RUN apt-get update && apt-get install -y git \
  unzip \
  zip \
  build-essential \
  curl
WORKDIR /opt/
COPY sunbird-player.zip  /opt/
RUN unzip /opt/sunbird-player.zip 
WORKDIR /opt/player/dist
RUN node server.js
