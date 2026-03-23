#!/usr/bin/env bash
set -euo pipefail

# Deploy Linkist to Kubernetes
# Usage: ./k8s/deploy.sh
#
# Prerequisites:
#   - kubectl configured with your cluster
#   - Container image pushed to registry
#   - secret.yaml filled in with real values

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Deploying Linkist to Kubernetes ==="

# 1. Namespace
echo "Creating namespace..."
kubectl apply -f "$SCRIPT_DIR/namespace.yaml"

# 2. Secrets & Config
echo "Applying secrets and config..."
kubectl apply -f "$SCRIPT_DIR/secret.yaml"
kubectl apply -f "$SCRIPT_DIR/configmap.yaml"

# 3. Database
echo "Deploying PostgreSQL..."
kubectl apply -f "$SCRIPT_DIR/postgres.yaml"
echo "Waiting for PostgreSQL to be ready..."
kubectl -n linkist rollout status statefulset/postgres --timeout=120s

# 4. Application
echo "Deploying application..."
kubectl apply -f "$SCRIPT_DIR/app.yaml"
kubectl -n linkist rollout status deployment/linkist-app --timeout=120s

# 5. Ingress
echo "Configuring ingress..."
kubectl apply -f "$SCRIPT_DIR/ingress.yaml"

# 6. Backup CronJob
echo "Setting up backup schedule..."
kubectl apply -f "$SCRIPT_DIR/backup-cronjob.yaml"

echo ""
echo "=== Deployment complete ==="
echo "App: https://linkist.vip"
echo ""
echo "Useful commands:"
echo "  kubectl -n linkist get pods"
echo "  kubectl -n linkist logs -l app=linkist-app -f"
echo "  kubectl -n linkist create job backup-manual --from=cronjob/db-backup  # manual backup"
