# Dockerfile for the player setup
FROM node:14.19.0-slim
RUN useradd -u 1001 -m -s /bin/bash sunbird
WORKDIR /usr/src/app
COPY --chown=sunbird . .
USER sunbird
EXPOSE 4000
CMD ["node", "server.js"]
