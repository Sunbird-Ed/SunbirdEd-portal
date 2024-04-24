# Use a base image suitable for building the client and server (e.g., Node.js)
FROM node:18.20.2 AS builder
ARG commit_hash="x.x.x"
ENV commit_hash=${commit_hash}

# # Install nvm to manage Node.js versions
# RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# Set the working directory for the client build
WORKDIR /usr/src/app/client

# Remove existing node_modules and yarn.lock to ensure clean installation
RUN rm -rf node_modules \
    && rm -rf yarn.lock \
    && yarn cache clean

# Copy the client code into the Docker container
COPY src/app/client ./

# Install client dependencies and build
RUN yarn install --no-progress --production=true \
    && npm run build



# Set the working directory for server build
WORKDIR /usr/src/app

# Copy server-related files into the app_dist directory
COPY src/app/libs ./app_dist/libs
COPY src/app/helpers ./app_dist/helpers
COPY src/app/proxy ./app_dist/proxy
COPY src/app/resourcebundles ./app_dist/resourcebundles
COPY src/app/package.json ./app_dist/
COPY src/app/framework.config.js ./app_dist/
COPY src/app/sunbird-plugins ./app_dist/sunbird-plugins
COPY src/app/routes ./app_dist/routes
COPY src/app/constants ./app_dist/constants
COPY src/app/controllers ./app_dist/controllers
COPY src/app/server.js ./app_dist/

# Install server dependencies in the app_dist directory
WORKDIR /usr/src/app/app_dist
RUN yarn install --ignore-engines --no-progress --production=true

FROM node:18.20.2

WORKDIR /usr/src/app
COPY  --from=builder /usr/src/app ./
# Run the build script
WORKDIR /usr/src/app/app_dist
RUN mv dist/index.html dist/index.ejs
RUN sed -i "/version/a\    \"buildHash\": \"${commit_hash}\"," package.json
RUN node helpers/resourceBundles/build.js -task="phraseAppPull"
EXPOSE 3000
CMD ["node", "server.js", "&"]