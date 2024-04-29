# Stage 1: Build the client
FROM node:18.20.2 AS client_builder

# Set the commit hash as a build argument and environment variable
ARG commit_hash="x.x.x"
ENV commit_hash=${commit_hash}

# Set the working directory for the client build
WORKDIR /usr/src/app/client

# Copy the client code into the Docker container
COPY src/app/client ./


# Install client dependencies and build
RUN yarn install --no-progress --frozen-lockfile --production=true \
    && npm run build

# Stage 2: Build the server
FROM node:18.20.2 AS server_builder

# Set the commit hash as a build argument and environment variable
ARG commit_hash="x.x.x"
ENV commit_hash=${commit_hash}

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
RUN yarn install --no-progress --frozen-lockfile --ignore-engines --production=true

# Stage 3: Final image
FROM node:18.20.2

# Set the commit hash as a build argument and environment variable
ARG commit_hash="x.x.x"
ENV commit_hash=${commit_hash}

WORKDIR /usr/src/app
# COPY --from=client_builder /usr/src/app/client/dist ./client/dist
COPY --from=server_builder /usr/src/app/app_dist ./app_dist

# Rename the index.html file to index.ejs
RUN mv ./app_dist/dist/index.html ./app_dist/dist/index.ejs

# Add the build hash to package.json
RUN sed -i "/version/a\    \"buildHash\": \"${commit_hash}\"," ./app_dist/package.json

# Run additional build tasks, if any (e.g., phraseAppPull)
RUN node ./app_dist/helpers/resourceBundles/build.js -task="phraseAppPull"

# Expose the port used by the server
EXPOSE 3000

# Start the server
CMD ["node", "./app_dist/server.js"]
