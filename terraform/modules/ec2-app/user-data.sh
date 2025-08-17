#!/bin/bash

# User data script for Tabsur application instances
set -e

echo "Starting Tabsur application instance setup..."
echo "Environment: ${environment}"
echo "App Name: ${app_name}"

# Update system
echo "Updating system packages..."
apt-get update -y
apt-get upgrade -y

# Install required packages
echo "Installing required packages..."
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    unzip \
    awscli

# Install Docker
echo "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
echo "Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create application directory
echo "Creating application directory..."
mkdir -p /opt/tabsur
cd /opt/tabsur

# Create docker-compose file for this environment
echo "Creating docker-compose configuration..."
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  server:
    image: 272007598366.dkr.ecr.eu-central-1.amazonaws.com/tabsur-server:latest
    container_name: tabsur-server
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=5000
      - DB_HOST=localhost
      - DB_PORT=5432
      - DB_NAME=coolanu
      - DB_USER=coolanu_user
      - DB_PASSWORD=your_password
      - DB_SSL=false
      - JWT_SECRET=your_jwt_secret
      - GOOGLE_MAPS_API_KEY=your_google_maps_key
      - CORS_ORIGIN=http://localhost:3000
    ports:
      - "5000:5000"
    networks:
      - tabsur-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/system/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  client:
    image: 272007598366.dkr.ecr.eu-central-1.amazonaws.com/tabsur-client:latest
    container_name: tabsur-client
    restart: unless-stopped
    environment:
      - REACT_APP_SERVER_HOST=http://localhost:5000
      - REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
    ports:
      - "80:80"
    depends_on:
      server:
        condition: service_healthy
    networks:
      - tabsur-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s

networks:
  tabsur-network:
    driver: bridge
EOF

# Create environment file template
echo "Creating environment file template..."
cat > .env.template << 'EOF'
# Tabsur Environment Variables
# Copy this to .env and fill in actual values

# ECR Image URIs
SERVER_ECR_URI=your-server-ecr-uri
CLIENT_ECR_URI=your-client-ecr-uri

# Database Configuration
DB_HOST=your-database-host
DB_PASSWORD=your-database-password

# Security
JWT_SECRET=your-jwt-secret

# External Services
GOOGLE_MAPS_API_KEY=your-google-maps-key
CORS_ORIGIN=your-cors-origin
EOF

# Create startup script
echo "Creating startup script..."
cat > start.sh << 'EOF'
#!/bin/bash

# Startup script for Tabsur application
set -e

echo "Starting Tabsur application..."

# Check if environment file exists
if [ ! -f .env ]; then
    echo "ERROR: .env file not found. Please create it from .env.template"
    exit 1
fi

# Login to ECR
echo "Logging into ECR..."
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 272007598366.dkr.ecr.eu-central-1.amazonaws.com/tabsur-server

# Pull latest images
echo "Pulling latest images..."
docker-compose pull

# Start services
echo "Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "Waiting for services to be healthy..."
sleep 30

# Check service status
echo "Service status:"
docker-compose ps

# Health checks
echo "Running health checks..."
if curl -f http://localhost:80/health; then
    echo "SUCCESS: Client health check passed"
else
    echo "ERROR: Client health check failed"
fi

if curl -f http://localhost:5000/api/system/health; then
    echo "SUCCESS: Server health check passed"
else
    echo "ERROR: Server health check failed"
fi

echo "Tabsur application started successfully!"
EOF

chmod +x start.sh

# Create systemd service for auto-start
echo "Creating systemd service..."
cat > /etc/systemd/system/tabsur.service << EOF
[Unit]
Description=Tabsur Application
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/tabsur
ExecStart=/opt/tabsur/start.sh
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
echo "Enabling and starting Tabsur service..."
systemctl daemon-reload
systemctl enable tabsur.service

# Create monitoring script
echo "Creating monitoring script..."
cat > /opt/tabsur/monitor.sh << 'EOF'
#!/bin/bash

# Monitoring script for Tabsur application
echo "Tabsur Application Status"
echo "============================"

# Docker containers status
echo "Container Status:"
docker-compose ps

# Health checks
echo ""
echo "Health Checks:"
if curl -s -f http://localhost:80/health > /dev/null; then
    echo "SUCCESS: Client: Healthy"
else
    echo "ERROR: Client: Unhealthy"
fi

if curl -s -f http://localhost:5000/api/system/health > /dev/null; then
    echo "SUCCESS: Server: Healthy"
else
    echo "ERROR: Server: Unhealthy"
fi

# Resource usage
echo ""
echo "Resource Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
EOF

chmod +x /opt/tabsur/monitor.sh

# Create log rotation
echo "Setting up log rotation..."
cat > /etc/logrotate.d/tabsur << 'EOF'
/opt/tabsur/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 root root
}
EOF

# Create logs directory
mkdir -p /opt/tabsur/logs

echo "Tabsur application instance setup completed!"
echo "Next steps:"
echo "1. Copy .env file with actual values"
echo "2. Run: cd /opt/tabsur && ./start.sh"
echo "3. Monitor with: ./monitor.sh"
echo "4. Check logs: docker-compose logs -f"
