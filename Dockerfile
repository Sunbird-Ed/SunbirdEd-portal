FROM node:8.11.3-alpine
MAINTAINER "Rajesh R <rajesh.r@optit.co>"

WORKDIR /home/sunbird
ADD player-dist.tar.gz /home/sunbird/
WORKDIR /home/sunbird/app_dist
# This is the short commit hash from which this image is built from
# This label is assigned at time of image creation
# LABEL vcs-ref
EXPOSE 3000
CMD ["node", "server.js", "&"]
