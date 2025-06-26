# Dockerfile for the player setup
FROM node:18.20.8-slim
RUN useradd -u 1001 -md /home/sunbird sunbird
WORKDIR /home/sunbird
COPY --chown=sunbird . /home/sunbird/app_dist/
USER sunbird
WORKDIR /home/sunbird/app_dist
# Install fontconfig
RUN apt-get update && apt-get install -y fontconfig

# Create a directory for fonts
RUN mkdir -p /usr/local/share/fonts

# Copy your font files (replace with your actual font files)
COPY fonts/* /usr/local/share/fonts/

# Update font cache
RUN fc-cache -f -v
EXPOSE 3000
CMD ["node", "server.js", "&"]
