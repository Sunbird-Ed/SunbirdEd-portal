# Dockerfile for the player setup
FROM node:18.20.8-slim
RUN useradd -u 1001 -md /home/sunbird sunbird
WORKDIR /home/sunbird
COPY --chown=sunbird . /home/sunbird/app_dist/
USER sunbird
WORKDIR /home/sunbird/app_dist
EXPOSE 3000
RUN apt-get update && \
    apt-get install -y chromium-browser --no-install-recommends

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_DOWNLOAD=true
CMD ["node", "server.js", "&"]
