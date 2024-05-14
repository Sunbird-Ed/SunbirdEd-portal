
# Use a base image suitable for building the client and server (e.g., Node.js)
FROM node:18.20.2 AS builder

# Set the commit hash as a build argument and environment variable
ARG commit_hash="x.x.x"
ENV commit_hash= ${commit_hash}

# Print the commit hash
RUN echo "Commit Hash: ${commit_hash}"

# Set the working directory for the client build
WORKDIR /usr/src/app/client

# Copy the client code into the Docker container
COPY src/app/client ./

RUN rm -rf node_modules yarn.lock
RUN yarn cache clean
# Install client dependencies and build
RUN yarn install --no-progress --frozen-lockfile --production=true \
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
RUN yarn install --no-progress --frozen-lockfile --ignore-engines --production=true

# Start a new stage for the final image
FROM node:18.20.2

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./

# Rename the index.html file to index.ejs
WORKDIR /usr/src/app/app_dist
RUN mv dist/index.html dist/index.ejs
# Print the commit hash
RUN echo "Commit Hash: ${commit_hash}"
# Add the build hash to package.json
RUN sed -i "/version/a\    \"buildHash\": \"${commit_hash}\"," package.json

# Run the build script to perform additional tasks (e.g., phraseAppPull)
RUN node helpers/resourceBundles/build.js -task="phraseAppPull"

# Expose the port used by the server
EXPOSE 3000

# Start the server in the background
CMD ["node", "server.js"]