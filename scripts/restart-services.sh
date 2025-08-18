#!/bin/bash

# Restart Services on EC2 Instance with HTTPS Support
# This script restarts the Docker services on the EC2 instance with HTTPS

set -e

echo "🔄 Restarting Services on EC2 Instance with HTTPS"

# Load dynamic configuration if available
if [ -f "ec2-config.env" ]; then
    # shellcheck disable=SC1091
    source ec2-config.env
    INSTANCE_ID=${EC2_INSTANCE_ID}
    EC2_IP=${EC2_PUBLIC_IP}
else
    # Fallback values (should be overridden by ec2-config.env)
    INSTANCE_ID=""
    EC2_IP=""
fi

echo "Instance: ${INSTANCE_ID}"
echo "IP: ${EC2_IP}"
echo "Domain: bemyguest.dedyn.io"
echo ""

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first."
    exit 1
fi

# Check if instance is running
echo "🔍 Checking instance status..."
if [[ -n "$INSTANCE_ID" ]]; then
  INSTANCE_STATUS=$(aws ec2 describe-instances --instance-ids "$INSTANCE_ID" --query 'Reservations[*].Instances[*].State.Name' --output text || true)
else
  INSTANCE_STATUS="unknown"
fi

if [[ -n "$INSTANCE_ID" ]]; then
  if [[ "$INSTANCE_STATUS" != "running" ]]; then
      echo "❌ Instance is not running. Current status: $INSTANCE_STATUS"
      echo "🔄 Starting instance..."
      aws ec2 start-instances --instance-ids "$INSTANCE_ID"
      echo "⏳ Waiting for instance to start..."
      aws ec2 wait instance-running --instance-ids "$INSTANCE_ID"
      echo "✅ Instance is now running"
  else
      echo "✅ Instance is running"
  fi
else
  echo "⚠️  INSTANCE_ID not set; skipping instance status check"
fi

# Get ECR registry
ECR_REGISTRY="272007598366.dkr.ecr.eu-central-1.amazonaws.com"
REGION="eu-central-1"

echo ""
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

echo ""
echo "🐳 Building and pushing latest images..."

# Build server image
echo "Building server image..."
docker build -f Dockerfile.server.multistage -t $ECR_REGISTRY/tabsur-server:latest .
docker push $ECR_REGISTRY/tabsur-server:latest

# Build client image
echo "Building client image..."
docker build -f Dockerfile.client.multistage -t $ECR_REGISTRY/tabsur-client:latest .
docker push $ECR_REGISTRY/tabsur-client:latest

echo "✅ Images pushed to ECR"

echo ""
echo "📤 Creating HTTPS configuration files..."

# Create HTTPS-enabled docker-compose file
cat > docker-compose-https.yml << 'EOF'
version: '3.8'
services:
  server:
    image: 272007598366.dkr.ecr.eu-central-1.amazonaws.com/tabsur-server:latest
    container_name: tabsur-server
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=5000
      - DB_HOST=3.249.94.227
      - DB_PORT=5432
      - DB_NAME=coolanu
      - DB_USER=coolanu_user
      - DB_PASSWORD=${DB_PASSWORD:-your_db_password}
      - DB_SSL=false
      - JWT_SECRET=${JWT_SECRET:-your_jwt_secret}
      - GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY:-your_google_maps_key}
      - CORS_ORIGIN=https://bemyguest.dedyn.io
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
      - REACT_APP_SERVER_HOST=https://api.bemyguest.dedyn.io
      - REACT_APP_GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY:-your_google_maps_key}
    ports:
      - "80:80"
    depends_on:
      server:
        condition: service_healthy
    networks:
      - tabsur-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s

  loadbalancer:
    image: nginx:alpine
    container_name: tabsur-lb
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-https.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      server:
        condition: service_healthy
      client:
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
    ipam:
      config:
        - subnet: 172.20.0.0/16
EOF

# Create HTTPS Nginx configuration
cat > nginx-https.conf << 'EOF'
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
    upstream backend {
        server server:5000;
    }

    upstream frontend {
        server client:80;
    }

    # HTTP to HTTPS redirect for all domains
    server {
        listen 80;
        server_name bemyguest.dedyn.io www.bemyguest.dedyn.io api.bemyguest.dedyn.io;
        
        # Health check endpoint (accessible via HTTP)
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
        
        # Redirect all other requests to HTTPS
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # Main domain HTTPS - Frontend
    server {
        listen 443 ssl http2;
        server_name bemyguest.dedyn.io www.bemyguest.dedyn.io;

        # SSL Configuration
        ssl_certificate /etc/letsencrypt/live/bemyguest.dedyn.io/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/bemyguest.dedyn.io/privkey.pem;
        
        # SSL Security Settings
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Frontend static files
        location / {
            proxy_pass http://frontend;
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
    }

    # API subdomain HTTPS - Backend
    server {
        listen 443 ssl http2;
        server_name api.bemyguest.dedyn.io;

        # SSL Configuration (same certificate covers all subdomains)
        ssl_certificate /etc/letsencrypt/live/bemyguest.dedyn.io/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/bemyguest.dedyn.io/privkey.pem;
        
        # SSL Security Settings
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

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
            
            proxy_pass http://backend;
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
            
            proxy_pass http://backend;
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
            proxy_pass http://backend;
        }

        # Error pages
        error_page 404 /404.html;
        error_page 500 502 503 504 /50x.html;
        
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
EOF

echo "✅ HTTPS configuration files created"

echo ""
echo "🔒 HTTPS Setup Instructions:"
echo ""
echo "📋 PHASE 1: Initial HTTP Deployment (Do this first!)"
echo "1. SSH into the EC2 instance:"
echo "   ssh -i ~/.ssh/coolanu-postgres ubuntu@3.72.76.56"
echo ""
echo "2. Copy configuration files:"
echo "   scp -i ~/.ssh/coolanu-postgres docker-compose-https.yml ubuntu@${EC2_IP:-3.72.76.56}:~/"
echo "   scp -i ~/.ssh/coolanu-postgres nginx-https.conf ubuntu@${EC2_IP:-3.72.76.56}:~/"
echo ""
echo "3. Start HTTP services (this will work immediately):"
echo "   cd /opt/tabsur"
echo "   docker-compose -f docker-compose-https.yml down"
echo "   docker-compose -f docker-compose-https.yml up -d"
echo ""
echo "4. Test HTTP access:"
echo "   curl -I http://3.72.76.56:80/health"
echo "   curl -I http://bemyguest.dedyn.io/health"
echo ""
echo "📋 PHASE 2: HTTPS Setup (After HTTP is working)"
echo "5. Install certbot and generate SSL certificates:"
echo "   sudo apt update"
echo "   sudo apt install -y certbot"
echo "   sudo certbot certonly --standalone \\"
echo "     -d bemyguest.dedyn.io \\"
echo "     -d www.bemyguest.dedyn.io \\"
echo "     -d api.bemyguest.dedyn.io \\"
echo "     --email admin@bemyguest.dedyn.io \\"
echo "     --agree-tos \\"
echo "     --non-interactive"
echo ""
echo "6. Copy full HTTPS configuration:"
echo "   scp -i ~/.ssh/coolanu-postgres nginx-https-full.conf ubuntu@${EC2_IP:-3.72.76.56}:~/nginx-https.conf && sudo mv ~/nginx-https.conf /opt/tabsur/nginx-https.conf"
echo ""
echo "7. Restart services with HTTPS:"
echo "   docker-compose -f docker-compose-https.yml restart loadbalancer"
echo ""
echo "8. Test HTTPS:"
echo "   curl -k https://bemyguest.dedyn.io/health"
echo "   curl -k https://api.bemyguest.dedyn.io/health"
echo ""
echo "🌐 After setup, your app will be available at:"
echo "   Frontend: https://bemyguest.dedyn.io"
echo "   API: https://api.bemyguest.dedyn.io"
echo "   HTTP will automatically redirect to HTTPS"
echo ""
echo "💡 TROUBLESHOOTING:"
echo "   - If HTTP doesn't work, check Docker containers: docker-compose ps"
echo "   - If HTTPS fails, check SSL certificates: sudo certbot certificates"
echo "   - Check Nginx logs: docker-compose logs loadbalancer"
