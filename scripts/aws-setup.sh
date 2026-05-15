#!/bin/bash

# GenOps AI Platform - AWS Deployment Preparation Script
# This script prepares the AWS environment (ECR, EKS) for deployment.

REGION="us-east-1"
CLUSTER_NAME="genops-cluster"
APP_NAME="genops-ai"

echo "☁️  Preparing AWS Infrastructure for $APP_NAME..."

# 1. Create ECR Repositories
echo "📦 Creating ECR Repositories..."
aws ecr create-repository --repository-name $APP_NAME-backend --region $REGION || echo "Repo already exists"
aws ecr create-repository --repository-name $APP_NAME-frontend --region $REGION || echo "Repo already exists"

# 2. Create EKS Cluster (using eksctl)
echo "☸️  Setting up EKS Cluster (this may take 15-20 mins)..."
if ! command -v eksctl &> /dev/null; then
    echo "❌ eksctl not found. Please install it first."
else
    eksctl create cluster \
      --name $CLUSTER_NAME \
      --region $REGION \
      --nodegroup-name standard-nodes \
      --node-type t3.medium \
      --nodes 3 \
      --managed
fi

# 3. Update Kubeconfig
echo "🔧 Updating Kubeconfig..."
aws eks update-kubeconfig --region $REGION --name $CLUSTER_NAME

# 4. Install Nginx Ingress Controller
echo "🌐 Installing Nginx Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/aws/deploy.yaml

echo "✅ AWS Preparation Complete!"
echo "Next steps:"
echo "1. Update image names in k8s/backend.yaml and k8s/frontend.yaml to use ECR URIs."
echo "2. Run ./scripts/deploy.sh k8s"
