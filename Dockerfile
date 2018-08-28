FROM node:8.11-slim
MAINTAINER "Rajesh R <rajesh.r@optit.co>"

RUN useradd -u 1001 -md /home/sunbird sunbird
WORKDIR /home/sunbird
ADD player-dist.tar.gz /home/sunbird/
RUN chown -R sunbird:sunbird /home/sunbird
USER sunbird
WORKDIR /home/sunbird/app_dist
# This is the short commit hash from which this image is built from
# This label is assigned at time of image creation
# LABEL commitHash
EXPOSE 3000
CMD ["node", "server.js", "&"]
