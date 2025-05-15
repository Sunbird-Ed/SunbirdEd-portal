# Docker Build and Push Workflow

This repository includes a GitHub Actions workflow to automate the process of building and pushing Docker images to a container registry.

## Workflow Overview

The workflow is defined in [`.github/workflows/image-push.yml`](.github/workflows/image-push.yml). It triggers on every `push` to a tag in the repository.

### Key Features

- Builds the Docker image using the `build.sh` script.
- Supports multiple container registries:
  - Google Container Registry (GCR)
  - Azure Container Registry (ACR)
  - DockerHub Registry
  - GitHub Container Registry (GHCR)
- Automatically tags the Docker image with the Git tag and a short commit hash.

## Prerequisites

Before running this workflow, ensure the following:

1. **Secrets Configuration**:
   - Add or remove the required secrets based on the container registry you want to push to:
     - **For Google Container Registry (GCR)**:
       - `GCP_SERVICE_ACCOUNT_KEY`: Base64-encoded Google Cloud service account key.
       - `REGISTRY_NAME`: The registry name (e.g., `asia-south1-docker.pkg.dev`).
       - `REGISTRY_URL`: The full URL of the registry (e.g., `asia-south1-docker.pkg.dev/sunbird-morocco-sandbox-434709/sunbird-morocco-artifact-dev`).
     - **For DockerHub Registries**:
       - `REGISTRY_NAME`: The registry name (e.g., `docker.io`).
       - `REGISTRY_URL`: The full URL of the registry (e.g., `docker.io/username`).
       - `REGISTRY_USERNAME` and `REGISTRY_PASSWORD`: Credentials for the registry.
     - **For Azure Container Registry (ACR)**:
       - `REGISTRY_NAME`: The name of your Azure Container Registry (e.g., `myregistry.azurecr.io`).
       - `REGISTRY_URL`: The full URL of the registry(e.g., `myregistry.azurecr.io`)
       - `REGISTRY_USERNAME`: The username for your Azure Container Registry.
       - `REGISTRY_PASSWORD`: The password for your Azure Container Registry.

     - **For GitHub Container Registry (GHCR)**:
       - `GITHUB_TOKEN`: Automatically available for GitHub Container Registry.