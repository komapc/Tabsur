#!/bin/bash

# Deploy HTTPS Configuration to EC2
# This script deploys the HTTPS setup to your EC2 instance

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

echo -e "${GREEN}🚀 Deploying HTTPS Configuration to EC2${NC}"
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

# Deploy to EC2
echo -e "${BLUE}📤 Deploying to EC2...${NC}"

# Copy HTTPS configuration files
echo -e "${YELLOW}📁 Copying configuration files...${NC}"
scp -i $SSH_KEY nginx-https.conf ubuntu@$EC2_IP:/opt/tabsur/
scp -i $SSH_KEY docker-compose.ecr.yml ubuntu@$EC2_IP:/opt/tabsur/

# Deploy on EC2
echo -e "${YELLOW}🚀 Deploying on EC2...${NC}"
ssh -i $SSH_KEY ubuntu@$EC2_IP << 'EOF'
cd /opt/tabsur

echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.ecr.yml down

echo "🔐 Checking SSL certificates..."
if [ ! -d "/etc/letsencrypt/live/bemyguest.dedyn.io" ]; then
    echo "❌ SSL certificates not found. Please run setup-ssl.sh first."
    exit 1
fi

echo "✅ SSL certificates found"

echo "🚀 Starting services with HTTPS..."
docker-compose -f docker-compose.ecr.yml up -d

echo "⏳ Waiting for services to start..."
sleep 10

echo "📊 Checking service status..."
docker-compose -f docker-compose.ecr.yml ps

echo "🧪 Testing endpoints..."
echo "Testing HTTP redirect..."
curl -s -I "http://bemyguest.dedyn.io" | grep "301\|302" && echo "✅ HTTP redirect working" || echo "❌ HTTP redirect failed"

echo "Testing HTTPS frontend..."
curl -s -f "https://bemyguest.dedyn.io/health" > /dev/null && echo "✅ HTTPS frontend working" || echo "❌ HTTPS frontend failed"

echo "Testing HTTPS API..."
curl -s -f "https://api.bemyguest.dedyn.io/health" > /dev/null && echo "✅ HTTPS API working" || echo "❌ HTTPS API failed"

echo "🎉 HTTPS deployment completed!"
EOF

if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ HTTPS deployment completed successfully!${NC}"
else
    echo -e "${RED}❌ HTTPS deployment failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Your application is now available at:${NC}"
echo -e "  • https://$DOMAIN"
echo -e "  • https://www.$DOMAIN"
echo -e "  • https://api.$DOMAIN"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "  1. Test all endpoints in your browser"
echo -e "  2. Verify CORS is working correctly"
echo -e "  3. Check SSL certificate validity"
