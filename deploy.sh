#!/bin/bash

# Configuration
SSH_KEY="/c/Users/nxf86291/Desktop/OOP/aws/AlinKeyPair.pem"
EC2_USER="ec2-user"
EC2_IP="52.57.21.197"
REMOTE_DIR="~/elitywebstore"

echo "=========================================="
echo "Building and Deploying Elity Webstore"
echo "=========================================="

# Step 1: Build frontend locally
echo "[1/7] Building frontend locally..."
cd elitywebstore-frontend
npm run build
cd ..

# Step 2: Create directories on server
echo "[2/7] Creating directories on server..."
ssh -i "$SSH_KEY" "$EC2_USER@$EC2_IP" "mkdir -p $REMOTE_DIR/elitywebstore-frontend $REMOTE_DIR/target"

# Step 3: Upload backend Dockerfile and JAR
echo "[3/7] Uploading backend files..."
scp -i "$SSH_KEY" Dockerfile "$EC2_USER@$EC2_IP:$REMOTE_DIR/"
scp -i "$SSH_KEY" target/elitywebstore-0.0.1-SNAPSHOT.jar "$EC2_USER@$EC2_IP:$REMOTE_DIR/target/"

# Step 4: Upload frontend build folder
echo "[4/7] Uploading frontend build files..."
scp -r -i "$SSH_KEY" elitywebstore-frontend/build "$EC2_USER@$EC2_IP:$REMOTE_DIR/elitywebstore-frontend/"

# Step 5: Upload frontend config files
echo "[5/7] Uploading frontend config files..."
scp -i "$SSH_KEY" elitywebstore-frontend/Dockerfile elitywebstore-frontend/nginx.conf "$EC2_USER@$EC2_IP:$REMOTE_DIR/elitywebstore-frontend/"

# Step 6: Upload docker-compose and env files
echo "[6/7] Uploading docker-compose and env files..."
scp -i "$SSH_KEY" docker-compose.yml "$EC2_USER@$EC2_IP:$REMOTE_DIR/"
scp -i "$SSH_KEY" .env "$EC2_USER@$EC2_IP:$REMOTE_DIR/"

# Step 7: Deploy on EC2
echo "[7/7] Deploying on EC2..."
ssh -i "$SSH_KEY" "$EC2_USER@$EC2_IP" "cd $REMOTE_DIR && docker-compose down && docker-compose up -d --build"

echo "=========================================="
echo "Deployment complete!"
echo "=========================================="
echo ""
echo "  Frontend: http://52.57.21.197"
echo "  Backend:  http://52.57.21.197:8080"
echo ""
echo "=========================================="
echo "Useful commands:"
echo "=========================================="
echo ""
echo "  # SSH into server:"
echo "  ssh -i /c/Users/nxf86291/Desktop/OOP/aws/AlinKeyPair.pem ec2-user@52.57.21.197"
echo "  # View logs:"
echo "  cd ~/elitywebstore && docker-compose logs -f"
echo ""
echo "  # Check running containers:"
echo "  docker ps"
echo ""
echo "  # Stop all containers:"
echo "  cd ~/elitywebstore && docker-compose down"
echo ""
echo "  # Restart containers:"
echo "  cd ~/elitywebstore && docker-compose restart"
echo ""
echo "=========================================="
echo ""
echo "=========================================="
echo "MANUAL DEPLOYMENT (if needed)"
echo "=========================================="
echo ""
echo "# Build and run backend:"
echo "  cd ~/elitywebstore"
echo "  docker build -t elitywebstore-backend ."
echo "  docker run -d -p 8080:8080 --name backend --env-file .env --restart unless-stopped elitywebstore-backend"
echo ""
echo "# Build and run frontend:"
echo "  cd ~/elitywebstore/elitywebstore-frontend"
echo "  docker build -t elitywebstore-frontend ."
echo "  docker run -d -p 80:80 --name frontend --restart unless-stopped elitywebstore-frontend"
echo ""
echo "=========================================="
echo "=========================================="