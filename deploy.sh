#!/bin/bash

# Configuration
SSH_KEY="/c/Users/nxf86291/Desktop/OOP/aws/AlinKeyPair.pem"
EC2_USER="ec2-user"
EC2_IP="52.57.21.197"
REMOTE_DIR="~/elitywebstore"

echo "=========================================="
echo "Copying Elity Webstore files to AWS EC2"
echo "=========================================="

# Step 1: Create directories on server
echo "[1/5] Creating directories on server..."
ssh -i "$SSH_KEY" "$EC2_USER@$EC2_IP" "mkdir -p $REMOTE_DIR/elitywebstore-frontend $REMOTE_DIR/target"

# Step 2: Upload backend Dockerfile and JAR
echo "[2/5] Uploading backend files..."
scp -i "$SSH_KEY" Dockerfile "$EC2_USER@$EC2_IP:$REMOTE_DIR/"
scp -i "$SSH_KEY" target/elitywebstore-0.0.1-SNAPSHOT.jar "$EC2_USER@$EC2_IP:$REMOTE_DIR/target/"

# Step 3: Upload frontend source files
echo "[3/5] Uploading frontend source files..."
scp -r -i "$SSH_KEY" elitywebstore-frontend/src "$EC2_USER@$EC2_IP:$REMOTE_DIR/elitywebstore-frontend/"

# Step 4: Upload frontend public files
echo "[4/5] Uploading frontend public files..."
scp -r -i "$SSH_KEY" elitywebstore-frontend/public "$EC2_USER@$EC2_IP:$REMOTE_DIR/elitywebstore-frontend/"

# Step 5: Upload frontend config files
echo "[5/5] Uploading frontend config files..."
scp -i "$SSH_KEY" elitywebstore-frontend/package.json elitywebstore-frontend/package-lock.json elitywebstore-frontend/Dockerfile elitywebstore-frontend/nginx.conf "$EC2_USER@$EC2_IP:$REMOTE_DIR/elitywebstore-frontend/"

echo "=========================================="
echo "File upload complete!"
echo "=========================================="
echo ""
echo "To deploy, SSH into the server and run:"
echo ""
echo "# Build and run backend:"
echo "  cd ~/elitywebstore"
echo "  docker build -t elitywebstore-backend ."
echo "  docker run -d -p 8080:8080 --name backend --env-file .env --restart unless-stopped elitywebstore-backend"
echo "# Build and run frontend:"
echo "  cd ~/elitywebstore/elitywebstore-frontend"
echo "  docker build -t elitywebstore-frontend ."
echo "  docker run -d -p 80:80 --name frontend elitywebstore-frontend"
echo ""
echo "=========================================="