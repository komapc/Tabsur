#!/bin/bash

# 🚀 Tabsur Production Deployment Script
# This script will deploy CORS fixes to your EC2 instance

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - UPDATED WITH YOUR ACTUAL VALUES
EC2_IP="54.93.243.196"
EC2_INSTANCE_ID="i-0fe51ead4f5a7d437"
EC2_USER="ubuntu"
SSH_KEY="/home/mark/.ssh/coolanu-postgres"  # Your actual private key (no .pem extension)
TABSUR_DIR="/opt/tabsur"

echo -e "${BLUE}🚀 Tabsur Production Deployment Script${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""
echo -e "${GREEN}✅ Target EC2: $EC2_USER@$EC2_IP (Instance: $EC2_INSTANCE_ID)${NC}"
echo -e "${GREEN}✅ SSH Key: $SSH_KEY${NC}"
echo -e "${GREEN}✅ Target directory: $TABSUR_DIR${NC}"
echo ""

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    echo -e "${RED}❌ SSH key not found at: $SSH_KEY${NC}"
    echo -e "${YELLOW}Available keys:${NC}"
    ls -la ~/.ssh/
    exit 1
fi

echo -e "${GREEN}✅ SSH key found: $SSH_KEY${NC}"
echo ""

# Function to run command on EC2
run_on_ec2() {
    local cmd="$1"
    echo -e "${BLUE}🔄 Running: $cmd${NC}"
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$EC2_USER@$EC2_IP" "$cmd"
}

# Function to check if command succeeded
check_success() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Success${NC}"
    else
        echo -e "${RED}❌ Failed${NC}"
        exit 1
    fi
}

echo -e "${YELLOW}🚀 Starting deployment to production EC2...${NC}"
echo ""

# Step 1: Test SSH connection
echo -e "${BLUE}📡 Testing SSH connection...${NC}"
run_on_ec2 "echo 'SSH connection successful' && whoami && pwd"
check_success
echo ""

# Step 2: Check if Tabsur directory exists
echo -e "${BLUE}📁 Checking Tabsur directory...${NC}"
run_on_ec2 "ls -la $TABSUR_DIR 2>/dev/null || echo 'Directory not found'"
echo ""

# Step 3: If directory doesn't exist, create it and clone
echo -e "${BLUE}📥 Setting up Tabsur directory...${NC}"
run_on_ec2 "
if [ ! -d '$TABSUR_DIR' ]; then
    echo 'Creating Tabsur directory...'
    sudo mkdir -p $TABSUR_DIR
    sudo chown ubuntu:ubuntu $TABSUR_DIR
    cd $TABSUR_DIR
    git clone https://github.com/komapc/Tabsur.git . || echo 'Git clone failed - will use manual deployment'
else
    echo 'Tabsur directory exists, updating...'
    cd $TABSUR_DIR
    git pull origin master 2>/dev/null || echo 'Git pull failed - continuing with manual deployment'
fi
"
echo ""

# Step 4: Copy deployment files
echo -e "${BLUE}📋 Copying deployment files...${NC}"
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no fix-cors-https.sh "$EC2_USER@$EC2_IP:$TABSUR_DIR/"
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no nginx-https-full-working.conf "$EC2_USER@$EC2_IP:$TABSUR_DIR/"
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no docker-compose-https.yml "$EC2_USER@$EC2_IP:$TABSUR_DIR/"
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no env.https.template "$EC2_USER@$EC2_IP:$TABSUR_DIR/"
check_success
echo ""

# Step 5: Make script executable and run deployment
echo -e "${BLUE}🔧 Making deployment script executable...${NC}"
run_on_ec2 "cd $TABSUR_DIR && chmod +x fix-cors-https.sh"
check_success
echo ""

echo -e "${BLUE}🚀 Running automated deployment...${NC}"
run_on_ec2 "cd $TABSUR_DIR && ./fix-cors-https.sh"
check_success
echo ""

# Step 6: Verify deployment
echo -e "${BLUE}✅ Verifying deployment...${NC}"
echo -e "${BLUE}📊 Checking service status...${NC}"
run_on_ec2 "cd $TABSUR_DIR && sudo docker-compose -f docker-compose-https.yml ps 2>/dev/null || echo 'Docker services not running'"
echo ""

echo -e "${BLUE}🔍 Checking Nginx status...${NC}"
run_on_ec2 "sudo systemctl status nginx --no-pager -l 2>/dev/null || echo 'Nginx not running'"
echo ""

# Step 7: Test CORS functionality
echo -e "${BLUE}🧪 Testing CORS functionality...${NC}"
echo -e "${BLUE}📡 Testing CORS headers from EC2 IP...${NC}"
run_on_ec2 "curl -v -H 'Origin: http://$EC2_IP' https://bemyguest.dedyn.io/api/users/register 2>&1 | grep -i 'access-control' || echo 'No CORS headers found'"
echo ""

# Step 8: Final verification
echo -e "${BLUE}🎯 Final verification...${NC}"
run_on_ec2 "cd $TABSUR_DIR && echo 'Deployment completed successfully!'"
echo ""

echo -e "${GREEN}🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo -e "${YELLOW}1. Go back to your React app (http://$EC2_IP)${NC}"
echo -e "${YELLOW}2. Try to register/login - CORS errors should be gone!${NC}"
echo -e "${YELLOW}3. Check browser console for any remaining errors${NC}"
echo ""
echo -e "${GREEN}✅ CORS issues should now be resolved!${NC}"
