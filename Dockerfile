# Use a base image suitable for building the client and server (e.g., Node.js)
FROM node:18.20.2 AS builder

# Set the commit hash as a build argument and environment variable
ARG commit_hash="61753f1233"
ENV commit_hash=${commit_hash}

# Print the commit hash
RUN echo "Commit Hash: ${commit_hash}"

# Set the working directory for the client build
WORKDIR /usr/src/app/client

# Copy package.json and yarn.lock for client
COPY src/app/client/package.json src/app/client/yarn.lock ./

# Install client dependencies
RUN yarn install --no-progress --frozen-lockfile --production=true

# Copy the client code into the Docker container
COPY src/app/client ./

# Build the client
RUN yarn build

# Set the working directory for server build
WORKDIR /usr/src/app

# Copy package.json and yarn.lock for server
COPY src/app/package.json src/app/yarn.lock ./app_dist/

# Install server dependencies
WORKDIR /usr/src/app/app_dist
RUN yarn install --no-progress --frozen-lockfile --ignore-engines --production=true

# Copy server-related files into the app_dist directory
COPY src/app/libs ./libs
COPY src/app/helpers ./helpers
COPY src/app/proxy ./proxy
COPY src/app/resourcebundles ./resourcebundles
COPY src/app/framework.config.js ./
COPY src/app/sunbird-plugins ./sunbird-plugins
COPY src/app/routes ./routes
COPY src/app/constants ./constants
COPY src/app/controllers ./controllers
COPY src/app/server.js ./

# Start a new stage for the final image
FROM node:18.20.2

# Create a non-root user and group with specific UID and GID
RUN groupadd -g 1001 sunbird && \
    useradd -u 1001 -g sunbird -m -d /home/sunbird sunbird

# Set the working directory and copy the built files
WORKDIR /home/sunbird
COPY --chown=sunbird:sunbird --from=builder /usr/src/app /home/sunbird

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
RUN node helpers/resourceBundles/build.js -task="phraseAppPull"

# Expose the port used by the server
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]