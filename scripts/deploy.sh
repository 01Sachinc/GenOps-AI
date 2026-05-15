#!/bin/bash

# GenOps AI Platform - Unified Deployment Script
# Usage: ./deploy.sh [local|k8s]

MODE=$1
NAMESPACE="genops-prod"

echo "🚀 Starting GenOps AI Deployment in $MODE mode..."

if [ "$MODE" == "local" ]; then
    echo "📦 Building and starting Docker Compose..."
    docker-compose up -d --build
    echo "✅ Local deployment complete. Access at http://localhost:5173"

elif [ "$MODE" == "k8s" ]; then
    echo "☸️  Deploying to Kubernetes..."
    
    # Create namespace if not exists
    kubectl apply -f k8s/namespace.yaml
    
    # Apply Configs
    kubectl apply -f k8s/config/ -n $NAMESPACE
    
    # Apply Infrastructure
    kubectl apply -f k8s/postgres-pgvector.yaml -n $NAMESPACE
    kubectl apply -f k8s/redis.yaml -n $NAMESPACE
    
    # Wait for DB
    echo "⏳ Waiting for PostgreSQL to be ready..."
    kubectl wait --for=condition=ready pod -l app=genops-postgres -n $NAMESPACE --timeout=120s
    
    # Apply Applications
    kubectl apply -f k8s/backend.yaml -n $NAMESPACE
    kubectl apply -f k8s/frontend.yaml -n $NAMESPACE
    kubectl apply -f k8s/ingress.yaml -n $NAMESPACE
    
    echo "✅ Kubernetes deployment complete."
    echo "🔗 Access at http://genops.ai.local (Ensure /etc/hosts is updated)"

else
    echo "❌ Error: Please specify 'local' or 'k8s'"
    exit 1
fi
