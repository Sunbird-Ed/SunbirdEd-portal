# Stage 1: Install Node.js and build client
FROM node:18.20.2 AS client_builder

# Set environment variables
ENV NODE_VERSION=18.20.2
ENV NVM_DIR="/root/.nvm"

# Install NVM and Node.js
# RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# Set working directory for client
WORKDIR /app/client

# Copy package.json and yarn.lock for client
COPY src/app/client/package.json src/app/client/yarn.lock ./

# Install dependencies for client
RUN yarn install --frozen-lockfile --production=true

# Copy the rest of the client application
COPY src/app/client ./

# Build client
RUN npm run build && mv dist/index.html dist/index.ejs

# Stage 2: Build server
FROM node:18.20.2 AS server_builder

# Set working directory for server
WORKDIR /app

# Copy server files
COPY src/app/libs ./libs
COPY src/app/helpers ./helpers
COPY src/app/proxy ./proxy
COPY src/app/resourcebundles ./resourcebundles
COPY src/app/package.json ./package.json
COPY src/app/framework.config.js ./framework.config.js
COPY src/app/sunbird-plugins ./sunbird-plugins
COPY src/app/routes ./routes
COPY src/app/constants ./constants
COPY src/app/controllers ./controllers
COPY src/app/server.js ./server.js

# Install dependencies for server
RUN npm install --frozen-lockfile --production=true

# Execute resource bundles build task
RUN node helpers/resourceBundles/build.js -task="phraseAppPull"

# Copy built client files (if required)
# COPY --from=client_builder /app/client/dist ./client/dist

# Conditional CDN build
# ARG buildCdnAssests=false
# ARG cdnUrl=""

# RUN if [ "$buildCdnAssests" = "true" ]; then \
#     echo "Building client with CDN assets"; \
#     npm --prefix /app/client run build-cdn -- --deployUrl $cdnUrl && npm --prefix /app/client run inject-cdn-fallback; \
#     else \
#     echo "Building client without CDN assets"; \
#     fi

# Stage 3: Build Docker image
FROM node:18.20.2 AS final_builder

# Set working directory
WORKDIR /app

# Copy server files and built client files
COPY --from=server_builder /app/libs ./libs
COPY --from=server_builder /app/helpers ./helpers
COPY --from=server_builder /app/proxy ./proxy
COPY --from=server_builder /app/resourcebundles ./resourcebundles
COPY --from=server_builder /app/package.json ./package.json
COPY --from=server_builder /app/framework.config.js ./framework.config.js
COPY --from=server_builder /app/sunbird-plugins ./sunbird-plugins
COPY --from=server_builder /app/routes ./routes
COPY --from=server_builder /app/constants ./constants
COPY --from=server_builder /app/controllers ./controllers
COPY --from=server_builder /app/server.js ./server.js
# COPY --from=server_builder /app/client/dist ./client/dist

# Update package.json with commit hash
ARG commit_hash
RUN sed -i "/version/a\  \"buildHash\": \"${commit_hash}\"," package.json
echo commit_hash
# Install production dependencies
RUN npm install --frozen-lockfile --production=true

# Expose port if necessary

# Expose the port used by the server
EXPOSE 3000

# Start the server in the background
CMD ["node", "server.js"]
