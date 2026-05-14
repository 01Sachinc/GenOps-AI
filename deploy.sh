#!/bin/bash

# Ensure script stops on errors
set -e

# Default image name if not provided
IMAGE_NAME=${1:-"your-dockerhub-username/smartops-app:latest"}
CONTAINER_NAME="smartops-app"
PORT_MAPPING="80:8080"

echo "Starting deployment for $IMAGE_NAME..."

# Pull the latest image
echo "Pulling latest image..."
docker pull $IMAGE_NAME

# Check if the container exists
if [ $(docker ps -a -q -f name=^/${CONTAINER_NAME}$) ]; then
    echo "Container $CONTAINER_NAME exists."
    
    # Check if the container is running
    if [ $(docker ps -q -f name=^/${CONTAINER_NAME}$) ]; then
        echo "Stopping existing container..."
        docker stop $CONTAINER_NAME
    fi
    
    echo "Removing existing container..."
    docker rm $CONTAINER_NAME
else
    echo "No existing container found. Proceeding to run..."
fi

# Run the new container
echo "Running new container..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT_MAPPING \
    --restart unless-stopped \
    $IMAGE_NAME

echo "Deployment completed successfully!"
echo "Application is accessible on port 80."
