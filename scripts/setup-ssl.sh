#!/bin/bash

# SSL Setup Script for bemyguest.dedyn.io
# This script sets up HTTPS using Let's Encrypt certificates

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="bemyguest.dedyn.io"
API_DOMAIN="api.bemyguest.dedyn.io"
WWW_DOMAIN="www.bemyguest.dedyn.io"

echo -e "${GREEN}🔒 SSL Setup for ${DOMAIN}${NC}"
echo ""

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ This script should not be run as root${NC}"
   exit 1
fi

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}⚠️  Certbot not found. Installing...${NC}"
    sudo apt update
    sudo apt install -y certbot
else
    echo -e "${GREEN}✅ Certbot is installed${NC}"
fi

# Check if nginx is running
if ! pgrep -x "nginx" > /dev/null; then
    echo -e "${YELLOW}⚠️  Nginx not running. Starting...${NC}"
    sudo systemctl start nginx
fi

# Stop nginx temporarily to free port 80 for certbot
echo -e "${BLUE}🛑 Stopping nginx temporarily for certificate generation...${NC}"
sudo systemctl stop nginx

# Generate SSL certificates
echo -e "${BLUE}🔐 Generating SSL certificates...${NC}"
echo -e "${YELLOW}⏳ This may take a few minutes...${NC}"

# Generate certificates for all domains
sudo certbot certonly --standalone \
    -d $DOMAIN \
    -d $WWW_DOMAIN \
    -d $API_DOMAIN \
    --email admin@$DOMAIN \
    --agree-tos \
    --non-interactive

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SSL certificates generated successfully!${NC}"
else
    echo -e "${RED}❌ Failed to generate SSL certificates${NC}"
    echo -e "${YELLOW}🔄 Starting nginx again...${NC}"
    sudo systemctl start nginx
    exit 1
fi

# Verify certificates
echo -e "${BLUE}🔍 Verifying certificates...${NC}"
sudo certbot certificates

# Start nginx again
echo -e "${BLUE}🔄 Starting nginx with SSL configuration...${NC}"
sudo systemctl start nginx

# Test HTTPS
echo -e "${BLUE}🧪 Testing HTTPS...${NC}"
sleep 5

# Test main domain
if curl -s -k "https://$DOMAIN" > /dev/null; then
    echo -e "${GREEN}✅ HTTPS working for $DOMAIN${NC}"
else
    echo -e "${YELLOW}⚠️  HTTPS test failed for $DOMAIN${NC}"
fi

# Test API domain
if curl -s -k "https://$API_DOMAIN/health" > /dev/null; then
    echo -e "${GREEN}✅ HTTPS working for $API_DOMAIN${NC}"
else
    echo -e "${YELLOW}⚠️  HTTPS test failed for $API_DOMAIN${NC}"
fi

# Setup auto-renewal
echo -e "${BLUE}🔄 Setting up auto-renewal...${NC}"
sudo crontab -l 2>/dev/null | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet --post-hook 'systemctl reload nginx'"; } | sudo crontab -

echo ""
echo -e "${GREEN}🎉 SSL setup completed!${NC}"
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
echo -e "  1. Update your Docker Compose to use nginx-https.conf"
echo -e "  2. Restart your containers"
echo -e "  3. Test all endpoints"
