#!/bin/bash
set -e

echo "🚀 Starting Auth-Service Deployment on Minikube..."

echo "👉 Switching Docker to Minikube daemon..."
eval $(minikube -p minikube docker-env)

echo "👉 Building Auth-Service Docker image..."
docker build -t auth-service:latest .

echo "👉 Applying Postgres and Auth-Service Kubernetes manifests..."
kubectl apply -f k8s/postgres/
kubectl apply -f k8s/

echo "🔄 Restarting deployments..."
kubectl rollout restart deployment/auth-service || true
kubectl rollout restart deployment/postgres || true

echo "⏳ Waiting for pods to be ready..."
kubectl wait --for=condition=available --timeout=180s deployment/postgres
kubectl wait --for=condition=available --timeout=180s deployment/auth-service

echo "🌍 Opening Auth-Service URL..."
minikube service auth-service

echo "🎉 Auth-Service Deployment Completed Successfully!"
