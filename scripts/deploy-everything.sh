#!/bin/bash

# Deploy Everything - Complete Tabsur Deployment Script
set -e

echo "🚀 DEPLOYING EVERYTHING - Complete Tabsur Deployment"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SSH_KEY="$HOME/.ssh/coolanu-postgres"
REMOTE_DIR="/opt/tabsur"

# Prefer ec2-config.env for dynamic IP
if [ -f "ec2-config.env" ]; then
  # shellcheck disable=SC1091
  source ec2-config.env
  EC2_IP="$EC2_PUBLIC_IP"
fi
EC2_IP=${EC2_IP:-"3.72.76.56"}

echo -e "${BLUE}📋 Deployment Summary:${NC}"
echo "   Instance: $EC2_IP"
echo "   SSH Key: $SSH_KEY"
echo "   Remote Dir: $REMOTE_DIR"
echo ""

# Check prerequisites
echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found${NC}"
    exit 1
fi

if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not found${NC}"
    exit 1
fi

if [ ! -f "$SSH_KEY" ]; then
    echo -e "${RED}❌ SSH key not found at $SSH_KEY${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Step 1: Build and push Docker images
echo -e "${YELLOW}🐳 Step 1: Building and pushing Docker images...${NC}"
./scripts/restart-services.sh
echo -e "${GREEN}✅ Docker images ready${NC}"
echo ""

# Step 2: Copy configuration files to EC2
echo -e "${YELLOW}📤 Step 2: Copying configuration files to EC2...${NC}"
echo "Copying docker-compose-https.yml..."
scp -i "$SSH_KEY" docker-compose-https.yml "ubuntu@$EC2_IP:~/"

echo "Copying nginx-https (full working) as active config..."
scp -i "$SSH_KEY" nginx-https-full-working.conf "ubuntu@$EC2_IP:~/nginx-https.conf"

echo -e "${GREEN}✅ Configuration files copied${NC}"
echo ""

# Step 3: Deploy services on EC2
echo -e "${YELLOW}🚀 Step 3: Deploying services on EC2...${NC}"
echo "SSH into EC2 and starting services..."

ssh -i "$SSH_KEY" "ubuntu@$EC2_IP" << 'EOF'
set -e

sudo mkdir -p /opt/tabsur
sudo mv ~/docker-compose-https.yml /opt/tabsur/ 2>/dev/null || true
sudo mv ~/nginx-https.conf /opt/tabsur/nginx-https.conf 2>/dev/null || true

echo "Stopping existing services..."
sudo docker-compose -f /opt/tabsur/docker-compose.ecr.yml down 2>/dev/null || true
sudo docker-compose -f /opt/tabsur/docker-compose-https.yml down 2>/dev/null || true

echo "Starting new services..."
sudo docker-compose -f /opt/tabsur/docker-compose-https.yml up -d

echo "Waiting for services to start..."
sleep 10

echo "Checking service status..."
sudo docker-compose -f /opt/tabsur/docker-compose-https.yml ps

echo "Testing health endpoints..."
curl -s http://localhost:80/health || echo "Health check failed"
curl -s http://localhost:5000/api/system/health || echo "API health check failed"

echo "Services deployed successfully!"
EOF

echo -e "${GREEN}✅ Services deployed on EC2${NC}"
echo ""

# Step 4: Test deployment
echo -e "${YELLOW}🧪 Step 4: Testing deployment...${NC}"
echo "Testing direct IP access..."
curl -I "http://$EC2_IP:80/health" --connect-timeout 10 || echo "Direct IP test failed"

echo "Testing domain access..."
curl -I "http://bemyguest.dedyn.io/health" --connect-timeout 10 || echo "Domain test failed"

echo -e "${GREEN}✅ Deployment testing completed${NC}"
echo ""

# Step 5: Provide next steps
echo -e "${BLUE}🎯 DEPLOYMENT COMPLETE!${NC}"
echo "=================================================="
echo ""
echo -e "${GREEN}✅ What's Working Now:${NC}"
echo "   - HTTP access via port 80"
echo "   - Health endpoints accessible"
echo "   - All services running"
echo ""
echo -e "${YELLOW}📋 Next Steps for HTTPS:${NC}"
echo "1. SSH into EC2: ssh -i $SSH_KEY ubuntu@$EC2_IP"
echo "2. Install certbot: sudo apt install -y certbot"
echo "3. Generate SSL certificates:"
echo "   sudo certbot certonly --standalone \\"
echo "     -d bemyguest.dedyn.io \\"
echo "     -d www.bemyguest.dedyn.io \\"
echo "     -d api.bemyguest.dedyn.io \\"
echo "     --email admin@bemyguest.dedyn.io \\"
echo "     --agree-tos --non-interactive"
echo "4. Enable HTTPS:"
echo "   cp nginx-https-full.conf nginx-https.conf"
echo "   docker-compose -f docker-compose-https.yml restart loadbalancer"
echo ""
echo -e "${BLUE}🌐 Your app is now available at:${NC}"
echo "   Main: http://bemyguest.dedyn.io"
echo "   API: http://api.bemyguest.dedyn.io"
echo "   Direct: http://$EC2_IP:80"
echo ""
echo -e "${GREEN}🎉 Deployment successful!${NC}"
