# Use a base image suitable for building the client and server (e.g., Node.js)
FROM node:18.20.2 AS builder

# Set the working directory for the client build
WORKDIR /usr/src/app

# Copy the client and server code into the Docker container
COPY src/app ./

# Copy package.json and yarn.lock for client and server
COPY src/app/client/package.json src/app/client/yarn.lock ./client/
COPY src/app/package.json src/app/yarn.lock ./

# Install client dependencies and build the client
WORKDIR /usr/src/app/client
RUN yarn install --no-progress --frozen-lockfile --production=true && yarn build

# Switch back to the root directory and copy server-related files
WORKDIR /usr/src/app
COPY src/app/libs ./app_dist/libs
COPY src/app/helpers ./app_dist/helpers
COPY src/app/proxy ./app_dist/proxy
COPY src/app/resourcebundles ./app_dist/resourcebundles
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

# Set the commit hash as a build argument and environment variable
ARG commit_hash=""
ENV commit_hash=${commit_hash}

# Create a non-root user and group with specific UID and GID
RUN groupadd -g 1001 sunbird && \
    useradd -u 1001 -g sunbird -m -d /home/sunbird sunbird

# Set the working directory and copy the built files
WORKDIR /home/sunbird
COPY --chown=sunbird:sunbird --from=builder /usr/src/app/app_dist /home/sunbird/app_dist

# Switch to the non-root user
USER sunbird

# Rename the index.html file to index.ejs
WORKDIR /home/sunbird/app_dist
RUN mv dist/index.html dist/index.ejs

# Print the commit hash
RUN echo "Commit Hash: ${commit_hash}"

# Add the build hash to package.json
RUN sed -i "/version/a\    \"buildHash\": \"${commit_hash}\"," package.json

# Run the build script to perform additional tasks (e.g., phraseAppPull)
# Adjust the path based on your directory structure
RUN node helpers/resourceBundles/build.js -task="phraseAppPull"

# Expose the port used by the server
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
