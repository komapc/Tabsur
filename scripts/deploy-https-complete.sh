#!/bin/bash

# Complete HTTPS Deployment Script
# This script sets up SSL certificates and deploys HTTPS configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
EC2_IP="3.72.76.56"
SSH_KEY="$HOME/.ssh/coolanu-postgres"
DOMAIN="bemyguest.dedyn.io"
API_DOMAIN="api.bemyguest.dedyn.io"
WWW_DOMAIN="www.bemyguest.dedyn.io"

echo -e "${GREEN}🔒 Complete HTTPS Deployment for ${DOMAIN}${NC}"
echo ""

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

# Check SSH key
if [[ ! -f "$SSH_KEY" ]]; then
    echo -e "${RED}❌ SSH key not found at $SSH_KEY${NC}"
    exit 1
fi

# Check if nginx-https.conf exists
if [[ ! -f "nginx-https.conf" ]]; then
    echo -e "${RED}❌ nginx-https.conf not found${NC}"
    exit 1
fi

# Check if docker-compose.ecr.yml exists
if [[ ! -f "docker-compose.ecr.yml" ]]; then
    echo -e "${RED}❌ docker-compose.ecr.yml not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Step 1: Set up SSL certificates on EC2
echo -e "${BLUE}🔐 Step 1: Setting up SSL certificates on EC2...${NC}"

ssh -i $SSH_KEY ubuntu@$EC2_IP << 'EOF'
echo "📦 Installing certbot..."
sudo apt update
sudo apt install -y certbot

echo "🛑 Stopping any running nginx..."
sudo systemctl stop nginx 2>/dev/null || true

echo "🔐 Generating SSL certificates..."
sudo certbot certonly --standalone \
    -d bemyguest.dedyn.io \
    -d www.bemyguest.dedyn.io \
    -d api.bemyguest.dedyn.io \
    --email admin@bemyguest.dedyn.io \
    --agree-tos \
    --non-interactive

if [ $? -eq 0 ]; then
    echo "✅ SSL certificates generated successfully!"
    sudo certbot certificates
else
    echo "❌ Failed to generate SSL certificates"
    exit 1
fi
EOF

if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ SSL certificates generated successfully!${NC}"
else
    echo -e "${RED}❌ SSL certificate generation failed${NC}"
    exit 1
fi

echo ""

# Step 2: Deploy HTTPS configuration
echo -e "${BLUE}🚀 Step 2: Deploying HTTPS configuration...${NC}"

# Copy HTTPS configuration files
echo -e "${YELLOW}📁 Copying configuration files...${NC}"
scp -i $SSH_KEY nginx-https.conf ubuntu@$EC2_IP:/opt/tabsur/
scp -i $SSH_KEY docker-compose.ecr.yml ubuntu@$EC2_IP:/opt/tabsur/

# Deploy on EC2
echo -e "${YELLOW}🚀 Deploying on EC2...${NC}"
ssh -i $SSH_KEY ubuntu@$EC2_IP << 'EOF'
cd /opt/tabsur

echo "🔐 Verifying SSL certificates..."
if [ ! -d "/etc/letsencrypt/live/bemyguest.dedyn.io" ]; then
    echo "❌ SSL certificates not found"
    exit 1
fi

echo "✅ SSL certificates verified"

echo "🚀 Starting services with HTTPS..."
docker-compose -f docker-compose.ecr.yml up -d

echo "⏳ Waiting for services to start..."
sleep 15

echo "📊 Checking service status..."
docker-compose -f docker-compose.ecr.yml ps

echo "🧪 Testing endpoints..."
echo "Testing HTTP redirect..."
curl -s -I "http://bemyguest.dedyn.io" | grep "301\|302" && echo "✅ HTTP redirect working" || echo "❌ HTTP redirect failed"

echo "Testing HTTPS frontend..."
curl -s -f -k "https://bemyguest.dedyn.io/health" > /dev/null && echo "✅ HTTPS frontend working" || echo "❌ HTTPS frontend failed"

echo "Testing HTTPS API..."
curl -s -f -k "https://api.bemyguest.dedyn.io/health" > /dev/null && echo "✅ HTTPS API working" || echo "❌ HTTPS API failed"

echo "🎉 HTTPS deployment completed!"
EOF

if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ HTTPS deployment completed successfully!${NC}"
else
    echo -e "${RED}❌ HTTPS deployment failed${NC}"
    exit 1
fi

echo ""

# Step 3: Setup auto-renewal
echo -e "${BLUE}🔄 Step 3: Setting up SSL auto-renewal...${NC}"

ssh -i $SSH_KEY ubuntu@$EC2_IP << 'EOF'
echo "🔄 Setting up auto-renewal cron job..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --post-hook 'cd /opt/tabsur && docker-compose -f docker-compose.ecr.yml restart loadbalancer'") | crontab -

echo "🧪 Testing renewal process..."
sudo certbot renew --dry-run

echo "✅ SSL auto-renewal configured"
EOF

echo -e "${GREEN}✅ SSL auto-renewal configured${NC}"

echo ""
echo -e "${GREEN}🎉 Complete HTTPS deployment finished!${NC}"
echo ""
echo -e "${YELLOW}📋 Your application is now available at:${NC}"
echo -e "  • https://$DOMAIN"
echo -e "  • https://$WWW_DOMAIN"
echo -e "  • https://$API_DOMAIN"
echo ""
echo -e "${YELLOW}📋 SSL certificates will auto-renew every 60 days${NC}"
echo -e "${YELLOW}📋 HTTP requests automatically redirect to HTTPS${NC}"
echo ""
echo -e "${BLUE}🔧 Next steps:${NC}"
echo -e "  1. Test all endpoints in your browser"
echo -e "  2. Verify CORS is working correctly"
echo -e "  3. Check SSL certificate validity"
echo -e "  4. Update your client configuration to use HTTPS URLs"
