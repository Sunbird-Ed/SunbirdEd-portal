# Dockerfile for the player setup
FROM ubuntu:20.04

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

RUN useradd -u 1001 -md /home/sunbird sunbird
WORKDIR /home/sunbird
COPY --chown=sunbird . /home/sunbird/app_dist/
USER sunbird
WORKDIR /home/sunbird/app_dist
EXPOSE 3000
CMD ["node", "server.js", "&"]
