#!/bin/bash

# Production Deployment Script for Tabsur
# This script handles the complete deployment process including infrastructure and application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="prod"
AWS_REGION="eu-central-1"
ALB_DNS_NAME=""
DOMAIN="bemyguest.dedyn.io"

echo -e "${BLUE}🚀 Tabsur Production Deployment${NC}"
echo "=================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"
if ! command_exists aws; then
    echo -e "${RED}❌ AWS CLI not found. Please install it first.${NC}"
    exit 1
fi

if ! command_exists docker; then
    echo -e "${RED}❌ Docker not found. Please install it first.${NC}"
    exit 1
fi

if ! command_exists terraform; then
    echo -e "${RED}❌ Terraform not found. Please install it first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites are met${NC}"

# Check AWS credentials
echo -e "${YELLOW}🔑 Checking AWS credentials...${NC}"
if ! aws sts get-caller-identity >/dev/null 2>&1; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS credentials are configured${NC}"

# Step 1: Deploy Infrastructure
echo -e "${YELLOW}🏗️  Step 1: Deploying Infrastructure...${NC}"
cd terraform

# Initialize Terraform
echo "Initializing Terraform..."
terraform init

# Plan deployment
echo "Planning deployment..."
terraform plan -out=tabsur-plan.tfplan

# Apply infrastructure
echo "Applying infrastructure changes..."
terraform apply "tabsur-plan.tfplan"

# Get ALB DNS name
ALB_DNS_NAME=$(terraform output -raw alb_dns_name)
echo -e "${GREEN}✅ Infrastructure deployed. ALB: ${ALB_DNS_NAME}${NC}"

cd ..

# Step 2: Build and Push Docker Images
echo -e "${YELLOW}🐳 Step 2: Building and Pushing Docker Images...${NC}"

# Build server image
echo "Building server image..."
docker build -t tabsur-server -f Dockerfile.server.multistage .
docker tag tabsur-server:latest 272007598366.dkr.ecr.eu-central-1.amazonaws.com/tabsur-server:latest

# Build client image
echo "Building client image..."
docker build -t tabsur-client -f Dockerfile.client.multistage .
docker tag tabsur-client:latest 272007598366.dkr.ecr.eu-central-1.amazonaws.com/tabsur-client:latest

# Push to ECR
echo "Pushing images to ECR..."
docker push 272007598366.dkr.ecr.eu-central-1.amazonaws.com/tabsur-server:latest
docker push 272007598366.dkr.ecr.eu-central-1.amazonaws.com/tabsur-client:latest

echo -e "${GREEN}✅ Docker images built and pushed${NC}"

# Step 3: Deploy Application
echo -e "${YELLOW}📱 Step 3: Deploying Application...${NC}"

# Update EC2 config with current instance
CURRENT_INSTANCE=$(aws ec2 describe-instances \
    --filters "Name=tag:Name,Values=prod-tabsur-asg" "Name=instance-state-name,Values=running" \
    --query 'Reservations[0].Instances[0].{InstanceId:InstanceId,PublicIp:PublicIpAddress}' \
    --output text)

if [ "$CURRENT_INSTANCE" != "None" ]; then
    INSTANCE_ID=$(echo "$CURRENT_INSTANCE" | cut -f1)
    PUBLIC_IP=$(echo "$CURRENT_INSTANCE" | cut -f2)
    
    echo "Using instance: $INSTANCE_ID at $PUBLIC_IP"
    
    # Update ec2-config.env
    sed -i "s/EC2_INSTANCE_ID=.*/EC2_INSTANCE_ID=$INSTANCE_ID/" ec2-config.env
    sed -i "s/EC2_PUBLIC_IP=.*/EC2_PUBLIC_IP=$PUBLIC_IP/" ec2-config.env
    
    # Deploy to instance
    ./fast-ecr-deploy.sh
else
    echo -e "${RED}❌ No running instances found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Application deployed${NC}"

# Step 4: Health Checks
echo -e "${YELLOW}🏥 Step 4: Running Health Checks...${NC}"

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 30

# Test frontend
echo "Testing frontend..."
if curl -f "http://$ALB_DNS_NAME/health" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is healthy${NC}"
else
    echo -e "${RED}❌ Frontend health check failed${NC}"
fi

# Test backend
echo "Testing backend..."
if curl -f "http://$ALB_DNS_NAME/api/system/health" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
fi

# Step 5: Domain Configuration
echo -e "${YELLOW}🌐 Step 5: Domain Configuration${NC}"
echo "To complete the setup, you need to:"
echo "1. Update DNS for $DOMAIN to point to: $ALB_DNS_NAME"
echo "2. Once DNS is updated, enable HTTPS by setting:"
echo "   - enable_https = true"
echo "   - certificate_arn = \"[your-validated-certificate-arn]\""
echo "3. Run: cd terraform && terraform apply"

# Final status
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo "Access URLs:"
echo "- Frontend: http://$ALB_DNS_NAME/"
echo "- Backend API: http://$ALB_DNS_NAME/api/system/health"
echo "- Health Check: http://$ALB_DNS_NAME/health"
echo ""
echo "Next steps:"
echo "1. Configure domain DNS to point to ALB"
echo "2. Enable HTTPS with SSL certificate"
echo "3. Test domain access"
echo ""
echo "For HTTPS setup, see: HTTPS_SETUP.md"
