#!/bin/bash

# Fast Tabsur Deployment using ECR
set -e

echo "🚀 Fast Tabsur Deployment using ECR"

# Load configuration
if [ -f "ec2-config.env" ]; then
    source ec2-config.env
    echo "📱 Using instance: $EC2_INSTANCE_ID at $EC2_PUBLIC_IP"
else
    echo "❌ Configuration file not found."
    exit 1
fi

# Set AWS credentials
export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
export AWS_REGION=$AWS_REGION

echo "🔑 AWS credentials configured"

# Create ECR repositories
echo "📦 Creating ECR repositories..."
aws ecr create-repository --repository-name tabsur-server --region $AWS_REGION 2>/dev/null || echo "Repository tabsur-server already exists"
aws ecr create-repository --repository-name tabsur-client --region $AWS_REGION 2>/dev/null || echo "Repository tabsur-client already exists"

# Get ECR repository URIs
SERVER_ECR_URI=$(aws ecr describe-repositories --repository-names tabsur-server --query 'repositories[0].repositoryUri' --output text)
CLIENT_ECR_URI=$(aws ecr describe-repositories --repository-names tabsur-client --query 'repositories[0].repositoryUri' --output text)

echo "📦 Server ECR: $SERVER_ECR_URI"
echo "📦 Client ECR: $CLIENT_ECR_URI"

# Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $SERVER_ECR_URI

# Build and push images locally (much faster than on EC2)
echo "🏗️ Building Docker images locally..."

echo "Building server image..."
docker build -t tabsur-server -f Dockerfile.server .
docker tag tabsur-server:latest $SERVER_ECR_URI:latest

echo "Building client image..."
docker build -t tabsur-client -f Dockerfile.client .
docker tag tabsur-client:latest $CLIENT_ECR_URI:latest

echo "📤 Pushing images to ECR..."
docker push $SERVER_ECR_URI:latest
docker push $CLIENT_ECR_URI:latest

echo "✅ Images pushed to ECR successfully!"

# Create fast deployment docker-compose.yml
echo "📝 Creating fast deployment configuration..."
cat > docker-compose.ecr.yml << EOF
version: '3.8'
services:
  server:
    image: $SERVER_ECR_URI:latest
    container_name: tabsur-server
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=5000
      - DB_HOST=3.249.94.227
      - DB_PORT=5432
      - DB_NAME=coolanu
      - DB_USER=coolanu_user
<<<<<<< HEAD
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_SSL=false
      - JWT_SECRET=${JWT_SECRET}
      - GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
    ports:
      - "5000:5000"
    networks:
      - tabsur-network

  client:
    image: $CLIENT_ECR_URI:latest
    container_name: tabsur-client
    restart: unless-stopped
    environment:
      - REACT_APP_SERVER_HOST=http://localhost:5000
      - REACT_APP_GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
    ports:
      - "80:80"
    depends_on:
      - server
    networks:
      - tabsur-network

  loadbalancer:
    image: nginx:alpine
    container_name: tabsur-lb
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - server
      - client
    networks:
      - tabsur-network

networks:
  tabsur-network:
    driver: bridge
EOF

# Create nginx config
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server server:5000;
    }

    upstream frontend {
        server client:80;
    }

    server {
        listen 80;
        server_name _;

        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

# Copy configuration to EC2
echo "📤 Copying configuration to EC2..."
scp -i ~/.ssh/coolanu-postgres docker-compose.ecr.yml ubuntu@$EC2_PUBLIC_IP:/opt/tabsur/
scp -i ~/.ssh/coolanu-postgres nginx.conf ubuntu@$EC2_PUBLIC_IP:/opt/tabsur/

# Deploy on EC2 (much faster now - just pull and run!)
echo "🚀 Deploying on EC2..."
ssh -i ~/.ssh/coolanu-postgres ubuntu@$EC2_PUBLIC_IP << EOF
cd /opt/tabsur

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $SERVER_ECR_URI

# Pull images (fast - no building!)
echo "📥 Pulling images from ECR..."
docker pull $SERVER_ECR_URI:latest
docker pull $CLIENT_ECR_URI:latest

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.ecr.yml up -d

echo "✅ Deployment complete!"
docker-compose -f docker-compose.ecr.yml ps
EOF

echo ""
echo "🎉 Fast ECR-based deployment completed!"
echo "⏱️ Total time: ~5-10 minutes (vs 15-30 minutes without ECR)"
echo "🌐 Your app is now available at:"
echo "   Main App: http://$EC2_PUBLIC_IP"
echo "   API: http://$EC2_PUBLIC_IP:5000"
echo "   Load Balancer: http://$EC2_PUBLIC_IP:8080"
echo ""
echo "💡 Benefits of this approach:"
echo "   ✅ Images built locally (faster, more reliable)"
echo "   ✅ ECR provides versioning and rollback"
echo "   ✅ No need to copy source code to EC2"
echo "   ✅ Consistent deployments across environments"
