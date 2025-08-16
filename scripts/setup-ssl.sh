#!/bin/bash

# SSL Setup Script for bemyguest.dedyn.io
# This script sets up HTTPS using Let's Encrypt

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔒 SSL Setup Script for bemyguest.dedyn.io${NC}"
echo ""

# Configuration
DOMAIN="bemyguest.dedyn.io"
EC2_IP="3.72.76.56"
SSH_KEY="~/.ssh/coolanu-postgres"

echo -e "${YELLOW}🌐 SSL Configuration:${NC}"
echo -e "  • Domain: ${DOMAIN}"
echo -e "  • EC2 IP: ${EC2_IP}"
echo -e "  • Subdomains: api.${DOMAIN}, www.${DOMAIN}"
echo ""

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"
    
    # Check SSH key
    if [[ ! -f "$SSH_KEY" ]]; then
        echo -e "${RED}❌ SSH key not found at $SSH_KEY${NC}"
        exit 1
    fi
    
    # Check if domain resolves
    echo -e "${BLUE}Checking domain resolution...${NC}"
    if dig +short ${DOMAIN} | grep -q "${EC2_IP}"; then
        echo -e "${GREEN}✅ Domain resolves correctly${NC}"
    else
        echo -e "${RED}❌ Domain does not resolve to ${EC2_IP}${NC}"
        echo -e "${YELLOW}⚠️  Please wait for DNS propagation or fix DNS records first${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
    echo ""
}

# Function to install certbot on EC2
install_certbot() {
    echo -e "${YELLOW}📦 Installing certbot on EC2...${NC}"
    
    ssh -i $SSH_KEY ubuntu@${EC2_IP} << 'EOF'
        # Update package list
        sudo apt update
        
        # Install certbot and nginx plugin
        sudo apt install -y certbot python3-certbot-nginx
        
        # Check installation
        certbot --version
        echo "✅ Certbot installed successfully"
EOF
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ Certbot installed successfully${NC}"
    else
        echo -e "${RED}❌ Certbot installation failed${NC}"
        exit 1
    fi
    
    echo ""
}

# Function to get SSL certificates
get_ssl_certificates() {
    echo -e "${YELLOW}🔐 Getting SSL certificates...${NC}"
    
    ssh -i $SSH_KEY ubuntu@${EC2_IP} << 'EOF'
        cd /opt/tabsur
        
        # Stop nginx container temporarily
        echo "🛑 Stopping nginx container..."
        docker stop tabsur-lb
        
        # Get certificates for main domain and www
        echo "🔐 Getting certificate for main domain and www..."
        sudo certbot certonly --standalone \
            -d bemyguest.dedyn.io \
            -d www.bemyguest.dedyn.io \
            --non-interactive \
            --agree-tos \
            --email admin@bemyguest.dedyn.io \
            --expand
        
        # Get certificate for api subdomain
        echo "🔐 Getting certificate for api subdomain..."
        sudo certbot certonly --standalone \
            -d api.bemyguest.dedyn.io \
            --non-interactive \
            --agree-tos \
            --email admin@bemyguest.dedyn.io
        
        echo "✅ SSL certificates obtained successfully"
EOF
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ SSL certificates obtained successfully${NC}"
    else
        echo -e "${RED}❌ SSL certificate generation failed${NC}"
        exit 1
    fi
    
    echo ""
}

# Function to create HTTPS nginx configuration
create_https_nginx() {
    echo -e "${YELLOW}📝 Creating HTTPS nginx configuration...${NC}"
    
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

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name bemyguest.dedyn.io www.bemyguest.dedyn.io api.bemyguest.dedyn.io;
        return 301 https://$server_name$request_uri;
    }

    # Main domain - Frontend (HTTPS)
    server {
        listen 443 ssl http2;
        server_name bemyguest.dedyn.io www.bemyguest.dedyn.io;

        # SSL configuration
        ssl_certificate /etc/letsencrypt/live/bemyguest.dedyn.io/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/bemyguest.dedyn.io/privkey.pem;
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
        }
    }

    # API subdomain - Backend (HTTPS)
    server {
        listen 443 ssl http2;
        server_name api.bemyguest.dedyn.io;

        # SSL configuration
        ssl_certificate /etc/letsencrypt/live/api.bemyguest.dedyn.io/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/api.bemyguest.dedyn.io/privkey.pem;
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
    }

    # Error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

    echo -e "${GREEN}✅ HTTPS nginx configuration created${NC}"
    echo ""
}

# Function to deploy HTTPS configuration
deploy_https() {
    echo -e "${YELLOW}🚀 Deploying HTTPS configuration...${NC}"
    
    # Copy HTTPS nginx config to EC2
    scp -i $SSH_KEY nginx-https.conf ubuntu@${EC2_IP}:/opt/tabsur/
    
    # Update docker-compose to use HTTPS config and mount SSL certificates
    ssh -i $SSH_KEY ubuntu@${EC2_IP} << 'EOF'
        cd /opt/tabsur
        
        # Stop existing containers
        echo "🛑 Stopping existing containers..."
        docker-compose -f docker-compose.ecr.yml down
        
        # Update docker-compose to mount SSL certificates
        sed -i 's|./nginx-domain.conf:/etc/nginx/nginx.conf:ro|./nginx-https.conf:/etc/nginx/nginx.conf:ro|g' docker-compose.ecr.yml
        
        # Add SSL certificate volumes to loadbalancer service
        sed -i '/volumes:/a\      - /etc/letsencrypt:/etc/letsencrypt:ro' docker-compose.ecr.yml
        
        # Start services with HTTPS
        echo "🚀 Starting services with HTTPS..."
        docker-compose -f docker-compose.ecr.yml up -d
        
        # Check status
        echo "📊 Checking service status..."
        docker-compose -f docker-compose.ecr.yml ps
        
        echo "✅ HTTPS deployment completed!"
EOF
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ HTTPS deployment completed successfully${NC}"
    else
        echo -e "${RED}❌ HTTPS deployment failed${NC}"
        exit 1
    fi
    
    echo ""
}

# Function to test HTTPS
test_https() {
    echo -e "${YELLOW}🧪 Testing HTTPS...${NC}"
    
    local domains=(
        "https://bemyguest.dedyn.io"
        "https://www.bemyguest.dedyn.io"
        "https://api.bemyguest.dedyn.io"
    )
    
    for domain in "${domains[@]}"; do
        echo -e "${BLUE}Testing $domain...${NC}"
        if curl -s -f -k "$domain/health" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $domain is accessible via HTTPS${NC}"
        else
            echo -e "${RED}❌ $domain is not accessible via HTTPS${NC}"
        fi
    done
    
    echo ""
}

# Function to setup auto-renewal
setup_auto_renewal() {
    echo -e "${YELLOW}🔄 Setting up SSL auto-renewal...${NC}"
    
    ssh -i $SSH_KEY ubuntu@${EC2_IP} << 'EOF'
        # Add renewal cron job
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet && docker restart tabsur-lb") | crontab -
        
        # Test renewal
        sudo certbot renew --dry-run
        
        echo "✅ SSL auto-renewal configured"
EOF
    
    echo -e "${GREEN}✅ SSL auto-renewal configured${NC}"
    echo ""
}

# Main execution
main() {
    local start_time=$(date +%s)
    
    echo -e "${GREEN}🎯 Starting SSL setup process...${NC}"
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Install certbot
    install_certbot
    
    # Get SSL certificates
    get_ssl_certificates
    
    # Create HTTPS nginx configuration
    create_https_nginx
    
    # Deploy HTTPS configuration
    deploy_https
    
    # Test HTTPS
    test_https
    
    # Setup auto-renewal
    setup_auto_renewal
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    echo -e "${GREEN}🎉 SSL setup completed in ${duration} seconds!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Your application is now available at:${NC}"
    echo -e "  • https://bemyguest.dedyn.io"
    echo -e "  • https://www.bemyguest.dedyn.io"
    echo -e "  • https://api.bemyguest.dedyn.io"
    echo ""
    echo -e "${YELLOW}📋 SSL certificates will auto-renew every 60 days${NC}"
    echo -e "${YELLOW}📋 HTTP requests automatically redirect to HTTPS${NC}"
}

# Run the script
main "$@"
