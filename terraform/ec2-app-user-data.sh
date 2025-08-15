#!/bin/bash

# Tabsur Application Stack Setup Script for EC2
set -e

echo "=== Starting Tabsur Application Stack Setup ==="

# Update system
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install Docker
echo "Installing Docker..."
apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
echo "Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Create application directory
echo "Setting up application directory..."
mkdir -p /opt/tabsur
cd /opt/tabsur

# Create docker-compose.yml for production
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # Server (Node.js/Express)
  server:
    image: tabsur-server:latest
    container_name: tabsur-server-prod
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=5000
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_SSL=${DB_SSL}
      - JWT_SECRET=${JWT_SECRET}
      - GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
    ports:
      - "5000:5000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/system/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - tabsur-network

  # Client (React/Nginx)
  client:
    image: tabsur-client:latest
    container_name: tabsur-client-prod
    restart: unless-stopped
    environment:
      - REACT_APP_SERVER_HOST=http://localhost:5000
      - REACT_APP_GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
    ports:
      - "80:80"
    depends_on:
      server:
        condition: service_healthy
    networks:
      - tabsur-network

  # Nginx Load Balancer
  loadbalancer:
    image: nginx:alpine
    container_name: tabsur-lb-prod
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - server
      - client
    networks:
      - tabsur-network

networks:
  tabsur-network:
    driver: bridge
EOF

# Create nginx load balancer configuration
cat > nginx-lb.conf << 'EOF'
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

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # API requests to backend
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # All other requests to frontend
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

# Create environment file template
cat > .env.template << 'EOF'
# Database Configuration
DB_HOST=3.249.94.227
DB_PORT=5432
DB_NAME=coolanu
DB_USER=coolanu_user
DB_PASSWORD=your_database_password_here
DB_SSL=false

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
EOF

# Create deployment script
cat > deploy.sh << 'EOF'
#!/bin/bash
echo "Deploying Tabsur application stack..."

# Check if environment file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file from .env.template and fill in your values:"
    echo "cp .env.template .env"
    echo "nano .env"
    exit 1
fi

# Load environment variables
export $(cat .env | xargs)

# Validate required variables
if [ -z "$DB_PASSWORD" ] || [ "$DB_PASSWORD" = "your_database_password_here" ]; then
    echo "❌ Please set DB_PASSWORD in .env file"
    exit 1
fi

if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your_jwt_secret_here" ]; then
    echo "❌ Please set JWT_SECRET in .env file"
    exit 1
fi

# Build images from source if available
if [ -d "/opt/tabsur/source" ]; then
    echo "Building from source..."
    cd /opt/tabsur/source
    
    # Build server
    docker build -t tabsur-server:latest -f Dockerfile.server .
    
    # Build client
    docker build -t tabsur-client:latest -f Dockerfile.client .
    
    cd /opt/tabsur
fi

# Start services
docker-compose up -d

echo "✅ Deployment completed!"
echo "Application available at:"
echo "- Main app: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "- API: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):5000"
echo "- Load balancer: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8080"
EOF

chmod +x deploy.sh

# Create health check script
cat > health-check.sh << 'EOF'
#!/bin/bash
echo "Checking service health..."

# Check if containers are running
if docker ps | grep -q "tabsur-server-prod"; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running"
fi

if docker ps | grep -q "tabsur-client-prod"; then
    echo "✅ Client is running"
else
    echo "❌ Client is not running"
fi

if docker ps | grep -q "tabsur-lb-prod"; then
    echo "✅ Load balancer is running"
else
    echo "❌ Load balancer is not running"
fi

# Check if services are responding
if curl -f http://localhost:5000/api/system/health > /dev/null 2>&1; then
    echo "✅ API is responding"
else
    echo "❌ API is not responding"
fi

if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Client is responding"
else
    echo "❌ Client is not responding"
fi

if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Load balancer is responding"
else
    echo "❌ Load balancer is not responding"
fi
EOF

chmod +x health-check.sh

# Create source code directory for building images
mkdir -p /opt/tabsur/source

echo "=== Setup Complete ==="
echo "Next steps:"
echo "1. Copy your source code to /opt/tabsur/source/"
echo "2. Create .env file: cp .env.template .env"
echo "3. Edit .env file with your actual values"
echo "4. Run: cd /opt/tabsur && ./deploy.sh"
echo "5. Check health: ./health-check.sh"
echo ""
echo "Your application will be available at:"
echo "- http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "- http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8080 (load balancer)"
