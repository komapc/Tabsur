#!/bin/bash

# Dual Deployment Script for Tabsur
# Deploys both release and debug versions to different subdomains

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Tabsur Dual Deployment Script${NC}"
echo -e "${YELLOW}Release: https://bemyguest.dedyn.io${NC}"
echo -e "${YELLOW}Debug: https://debug.bemyguest.dedyn.io${NC}"
echo -e "${YELLOW}API: https://api.bemyguest.dedyn.io${NC}"
echo ""

# Configuration
ECR_REGISTRY="272007598366.dkr.ecr.eu-central-1.amazonaws.com"
REGION="eu-central-1"
EC2_IP="3.72.76.56"
SSH_KEY="~/.ssh/coolanu-postgres"

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running${NC}"
        exit 1
    fi
    
    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI is not installed${NC}"
        exit 1
    fi
    
    # Check SSH key
    if [[ ! -f "$SSH_KEY" ]]; then
        echo -e "${RED}❌ SSH key not found at $SSH_KEY${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
    echo ""
}

# Function to build both versions
build_versions() {
    echo -e "${YELLOW}🐳 Building both release and debug versions...${NC}"
    
    # Build release versions
    echo -e "${BLUE}Building release server...${NC}"
    docker build \
        --target production \
        --cache-from $ECR_REGISTRY/tabsur-server:latest \
        -t $ECR_REGISTRY/tabsur-server:release \
        -f Dockerfile.server.multistage \
        .
    
    echo -e "${BLUE}Building release client...${NC}"
    docker build \
        --target production \
        --cache-from $ECR_REGISTRY/tabsur-client:latest \
        -t $ECR_REGISTRY/tabsur-client:release \
        -f Dockerfile.client.multistage \
        .
    
    # Build debug versions
    echo -e "${BLUE}Building debug server...${NC}"
    docker build \
        --target debug \
        --cache-from $ECR_REGISTRY/tabsur-server:latest \
        -t $ECR_REGISTRY/tabsur-server:debug \
        -f Dockerfile.server.multistage \
        .
    
    echo -e "${BLUE}Building debug client...${NC}"
    docker build \
        --target debug \
        --cache-from $ECR_REGISTRY/tabsur-client:latest \
        -t $ECR_REGISTRY/tabsur-client:debug \
        -f Dockerfile.client.multistage \
        .
    
    echo -e "${GREEN}✅ All versions built successfully${NC}"
    echo ""
}

# Function to push images
push_images() {
    echo -e "${YELLOW}📤 Pushing images to ECR...${NC}"
    
    # Push release versions
    docker push $ECR_REGISTRY/tabsur-server:release
    docker push $ECR_REGISTRY/tabsur-client:release
    
    # Push debug versions
    docker push $ECR_REGISTRY/tabsur-server:debug
    docker push $ECR_REGISTRY/tabsur-client:debug
    
    echo -e "${GREEN}✅ All images pushed successfully${NC}"
    echo ""
}

# Function to create dual docker-compose files
create_compose_files() {
    echo -e "${YELLOW}📝 Creating dual docker-compose files...${NC}"
    
    # Create release compose file
    cat > docker-compose.release.yml << 'EOF'
version: '3.8'
services:
  server:
    image: 272007598366.dkr.ecr.eu-central-1.amazonaws.com/tabsur-server:release
    container_name: tabsur-server-release
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=5000
      - DB_HOST=3.249.94.227
      - DB_PORT=5432
      - DB_NAME=coolanu
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_SSL=false
      - JWT_SECRET=${JWT_SECRET}
      - GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
      - CORS_ORIGIN=https://bemyguest.dedyn.io
    ports:
      - "5001:5000"
    networks:
      - tabsur-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/system/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  client:
    image: 272007598366.dkr.ecr.eu-central-1.amazonaws.com/tabsur-client:release
    container_name: tabsur-client-release
    restart: unless-stopped
    environment:
      - REACT_APP_SERVER_HOST=https://api.bemyguest.dedyn.io
      - REACT_APP_GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
    ports:
      - "81:80"
    depends_on:
      server:
        condition: service_healthy
    networks:
      - tabsur-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s

networks:
  tabsur-network:
    driver: bridge
EOF

    # Create debug compose file
    cat > docker-compose.debug.yml << 'EOF'
version: '3.8'
services:
  server:
    image: 272007598366.dkr.ecr.eu-central-1.amazonaws.com/tabsur-server:debug
    container_name: tabsur-server-debug
    restart: unless-stopped
    environment:
      - NODE_ENV=development
      - PORT=5000
      - DB_HOST=3.249.94.227
      - DB_PORT=5432
      - DB_NAME=coolanu
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_SSL=false
      - JWT_SECRET=${JWT_SECRET}
      - GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
      - CORS_ORIGIN=https://debug.bemyguest.dedyn.io
    ports:
      - "5002:5000"
    networks:
      - tabsur-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/system/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  client:
    image: 272007598366.dkr.ecr.eu-central-1.amazonaws.com/tabsur-client:debug
    container_name: tabsur-client-debug
    restart: unless-stopped
    environment:
      - REACT_APP_SERVER_HOST=https://api.bemyguest.dedyn.io
      - REACT_APP_GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
    ports:
      - "82:80"
    depends_on:
      server:
        condition: service_healthy
    networks:
      - tabsur-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s

networks:
  tabsur-network:
    driver: bridge
EOF

    echo -e "${GREEN}✅ Docker-compose files created${NC}"
    echo ""
}

# Function to create dual nginx configuration
create_dual_nginx() {
    echo -e "${YELLOW}📝 Creating dual nginx configuration...${NC}"
    
    cat > nginx-dual.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Upstream definitions
    upstream backend-release {
        server server-release:5000;
    }

    upstream backend-debug {
        server server-debug:5000;
    }

    upstream frontend-release {
        server client-release:80;
    }

    upstream frontend-debug {
        server client-debug:80;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name bemyguest.dedyn.io www.bemyguest.dedyn.io debug.bemyguest.dedyn.io api.bemyguest.dedyn.io;
        return 301 https://$server_name$request_uri;
    }

    # Release domain - Frontend
    server {
        listen 443 ssl http2;
        server_name bemyguest.dedyn.io www.bemyguest.dedyn.io;

        # SSL configuration (you'll need to add your SSL certificates)
        # ssl_certificate /etc/ssl/certs/bemyguest.dedyn.io.crt;
        # ssl_certificate_key /etc/ssl/private/bemyguest.dedyn.io.key;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Frontend static files
        location / {
            proxy_pass http://frontend-release;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Host $server_name;
        }
    }

    # Debug domain - Frontend
    server {
        listen 443 ssl http2;
        server_name debug.bemyguest.dedyn.io;

        # SSL configuration (same as above)
        # ssl_certificate /etc/ssl/certs/bemyguest.dedyn.io.crt;
        # ssl_certificate_key /etc/ssl/private/bemyguest.dedyn.io.key;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Frontend static files
        location / {
            proxy_pass http://frontend-debug;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Host $server_name;
        }
    }

    # API subdomain - Backend (shared between release and debug)
    server {
        listen 443 ssl http2;
        server_name api.bemyguest.dedyn.io;

        # SSL configuration (same as above)
        # ssl_certificate /etc/ssl/certs/bemyguest.dedyn.io.crt;
        # ssl_certificate_key /etc/ssl/private/bemyguest.dedyn.io.key;

        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # API endpoints with rate limiting
        location /api/ {
            # Rate limiting for API
            limit_req zone=api burst=20 nodelay;
            
            # Route to release backend by default
            proxy_pass http://backend-release;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Host $server_name;
            
            # Timeout settings
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }

        # Authentication endpoints with stricter rate limiting
        location ~ ^/api/(users|auth)/ {
            limit_req zone=login burst=10 nodelay;
            
            proxy_pass http://backend-release;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Host $server_name;
        }

        # Static assets (if any)
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            proxy_pass http://backend-release;
        }
    }

    # Error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

    echo -e "${GREEN}✅ Dual nginx configuration created${NC}"
    echo ""
}

# Function to deploy to EC2
deploy_to_ec2() {
    echo -e "${YELLOW}☁️  Deploying to EC2...${NC}"
    
    # Copy files to EC2
    echo -e "${BLUE}📤 Copying configuration files to EC2...${NC}"
    scp -i $SSH_KEY docker-compose.release.yml ubuntu@$EC2_IP:/opt/tabsur/
    scp -i $SSH_KEY docker-compose.debug.yml ubuntu@$EC2_IP:/opt/tabsur/
    scp -i $SSH_KEY nginx-dual.conf ubuntu@$EC2_IP:/opt/tabsur/
    scp -i $SSH_KEY env.domain ubuntu@$EC2_IP:/opt/tabsur/
    
    # Deploy on EC2
    ssh -i $SSH_KEY ubuntu@$EC2_IP << 'EOF'
        cd /opt/tabsur
        
        # Stop existing containers
        echo "🛑 Stopping existing containers..."
        docker-compose -f docker-compose.ecr.yml down 2>/dev/null || true
        docker-compose -f docker-compose.release.yml down 2>/dev/null || true
        docker-compose -f docker-compose.debug.yml down 2>/dev/null || true
        
        # Pull latest images
        echo "📥 Pulling latest images..."
        docker-compose -f docker-compose.release.yml pull
        docker-compose -f docker-compose.debug.yml pull
        
        # Start release services
        echo "🚀 Starting release services..."
        docker-compose -f docker-compose.release.yml up -d
        
        # Start debug services
        echo "🐛 Starting debug services..."
        docker-compose -f docker-compose.debug.yml up -d
        
        # Check status
        echo "📊 Checking service status..."
        echo "=== RELEASE SERVICES ==="
        docker-compose -f docker-compose.release.yml ps
        echo "=== DEBUG SERVICES ==="
        docker-compose -f docker-compose.debug.yml ps
        
        echo "✅ Dual deployment completed!"
EOF
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ Deployment completed successfully${NC}"
    else
        echo -e "${RED}❌ Deployment failed${NC}"
        exit 1
    fi
    
    echo ""
}

# Function to test deployment
test_deployment() {
    echo -e "${YELLOW}🧪 Testing deployment...${NC}"
    
    local domains=(
        "bemyguest.dedyn.io"
        "debug.bemyguest.dedyn.io"
        "api.bemyguest.dedyn.io"
    )
    
    for domain in "${domains[@]}"; do
        echo -e "${BLUE}Testing $domain...${NC}"
        if curl -s -f "http://$domain/health" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $domain is accessible${NC}"
        else
            echo -e "${RED}❌ $domain is not accessible${NC}"
        fi
    done
    
    echo ""
}

# Main execution
main() {
    local start_time=$(date +%s)
    
    echo -e "${GREEN}🎯 Starting dual deployment process...${NC}"
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Build both versions
    build_versions
    
    # Push images
    push_images
    
    # Create configuration files
    create_compose_files
    create_dual_nginx
    
    # Deploy to EC2
    deploy_to_ec2
    
    # Test deployment
    test_deployment
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    echo -e "${GREEN}🎉 Dual deployment completed in ${duration} seconds!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Your applications are now available at:${NC}"
    echo -e "  • Release: https://bemyguest.dedyn.io"
    echo -e "  • Debug: https://debug.bemyguest.dedyn.io"
    echo -e "  • API: https://api.bemyguest.dedyn.io"
    echo ""
    echo -e "${YELLOW}📋 Next steps:${NC}"
    echo -e "  1. Configure SSL certificates for HTTPS"
    echo -e "  2. Update your Google Maps API key"
    echo -e "  3. Test all application features"
    echo -e "  4. Monitor logs for any issues"
}

# Run the script
main "$@"
