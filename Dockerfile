# Use a base image suitable for building the client and server
FROM node:18.20.2 AS builder

# Arguments for CDN URL and buildCdnAssets
ARG cdnUrl=""
ENV cdnUrl=${cdnUrl}
ARG buildCdnAssets=""
ENV buildCdnAssets=${buildCdnAssets}

# Set the working directory for the client build
WORKDIR /usr/src/app/client

# Copy the client code into the Docker container
COPY src/app/client ./
RUN yarn cache clean

# Install client dependencies
RUN yarn install --no-progress --frozen-lockfile --production=true


# Build the client
RUN npm run build

# Build the client for CDN and inject CDN fallback
# Conditional build logic for CDN assets
RUN if [ "$buildCdnAssets" = "true" ]; then \
    echo "Building client CDN assets..."; \
    npm run build-cdn --deploy-url $cdnUrl && \
    export sunbird_portal_cdn_url=$cdnUrl && \
    npm run inject-cdn-fallback && \
    echo "Completed client CDN prod build."; \
    else \
    echo "Skipping client CDN assets build."; \
    fi

# Validate and copy CDN assets if they exist
RUN if [ "$buildCdnAssets" = "true" ]; then \
    echo "Validating and copying CDN assets..."; \
    if [ -d "src/app/dist-cdn" ] && [ "$(ls -A src/app/dist-cdn)" ]; then \
    mkdir -p /usr/src/app/cdn_assets && \
    cp -r src/app/dist-cdn/* /usr/src/app/cdn_assets/ && \
    echo "CDN assets copied successfully."; \
    else \
    echo "Directory src/app/dist-cdn does not exist or is empty. Skipping copy."; \
    fi; \
    else \
    echo "Skipping validation and copying of CDN assets."; \
    fi
# Set the working directory for server build
WORKDIR /usr/src/app

# Copy package.json and yarn.lock for server
COPY src/app/package.json src/app/yarn.lock ./app_dist/

# Copy server-related files into the app_dist directory before installing dependencies
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