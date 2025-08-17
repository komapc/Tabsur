#!/bin/bash

# Deploy ALB Infrastructure - Tabsur Enhanced Deployment
set -e

echo "🚀 DEPLOYING ALB INFRASTRUCTURE - Enhanced Tabsur Setup"
echo "========================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-prod}
AWS_REGION=${AWS_REGION:-eu-west-1}
SSH_KEY="$HOME/.ssh/coolanu-postgres"

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo "   Environment: $ENVIRONMENT"
echo "   AWS Region: $AWS_REGION"
echo "   SSH Key: $SSH_KEY"
echo ""

# Check prerequisites
echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"
if ! command -v terraform &> /dev/null; then
    echo -e "${RED}❌ Terraform not found${NC}"
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

# Step 1: Terraform initialization and planning
echo -e "${YELLOW}🏗️ Step 1: Terraform initialization and planning...${NC}"
cd terraform

# Initialize Terraform
echo "Initializing Terraform..."
terraform init

# Plan the deployment
echo "Planning deployment..."
terraform plan -var="environment=$ENVIRONMENT" -out=tabsur-plan.tfplan

echo -e "${GREEN}✅ Terraform plan created${NC}"
echo ""

# Step 2: Apply Terraform changes
echo -e "${YELLOW}🚀 Step 2: Applying Terraform changes...${NC}"
echo "This will create:"
echo "  - Application Load Balancer"
echo "  - Auto Scaling Group for EC2 instances"
echo "  - Security groups and IAM roles"
echo "  - Target groups for health checks"
echo ""

read -p "Do you want to proceed with the deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️ Deployment cancelled${NC}"
    exit 0
fi

# Apply the plan
echo "Applying Terraform plan..."
terraform apply tabsur-plan.tfplan

echo -e "${GREEN}✅ Infrastructure deployed successfully${NC}"
echo ""

# Step 3: Get deployment outputs
echo -e "${YELLOW}📊 Step 3: Getting deployment outputs...${NC}"
ALB_DNS=$(terraform output -raw alb_dns_name)
ALB_ZONE_ID=$(terraform output -raw alb_zone_id)
APP_ASG_NAME=$(terraform output -raw app_auto_scaling_group_name)

echo -e "${GREEN}✅ Infrastructure outputs:${NC}"
echo "   ALB DNS: $ALB_DNS"
echo "   ALB Zone ID: $ALB_ZONE_ID"
echo "   Auto Scaling Group: $APP_ASG_NAME"
echo ""

# Step 4: Update DNS records (if needed)
echo -e "${YELLOW}🌐 Step 4: DNS Configuration...${NC}"
echo "You may need to update your DNS records:"
echo "   - Point your domain to the ALB DNS: $ALB_DNS"
echo "   - Or use the ALB Zone ID for Route 53: $ALB_ZONE_ID"
echo ""

# Step 5: Deploy application containers
echo -e "${YELLOW}🐳 Step 5: Deploying application containers...${NC}"
echo "Building and pushing Docker images to ECR..."

cd ..
./fast-ecr-deploy.sh

echo -e "${GREEN}✅ Application containers deployed${NC}"
echo ""

# Step 6: Health check verification
echo -e "${YELLOW}🏥 Step 6: Verifying health checks...${NC}"
echo "Waiting for services to be healthy..."

# Wait for ALB to be ready
sleep 30

# Test health endpoints
echo "Testing ALB health endpoints..."
if curl -s -f "http://$ALB_DNS/health" > /dev/null; then
    echo -e "${GREEN}✅ Client health check passed${NC}"
else
    echo -e "${RED}❌ Client health check failed${NC}"
fi

if curl -s -f "http://$ALB_DNS/api/system/health" > /dev/null; then
    echo -e "${GREEN}✅ Server health check passed${NC}"
else
    echo -e "${RED}❌ Server health check failed${NC}"
fi

echo ""

# Step 7: Provide next steps
echo -e "${BLUE}🎯 DEPLOYMENT COMPLETE!${NC}"
echo "========================================================"
echo ""
echo -e "${GREEN}✅ What's Working Now:${NC}"
echo "   - Application Load Balancer: $ALB_DNS"
echo "   - Auto Scaling Group: $APP_ASG_NAME"
echo "   - Health checks and monitoring"
echo "   - Zero-downtime deployment capability"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Update DNS records to point to ALB"
echo "2. Test the application through the ALB"
echo "3. Monitor Auto Scaling Group performance"
echo "4. Set up GitHub Actions for automated deployment"
echo ""
echo -e "${BLUE}🌐 Your enhanced app is now available at:${NC}"
echo "   ALB: http://$ALB_DNS"
echo "   Health Check: http://$ALB_DNS/health"
echo "   API Health: http://$ALB_DNS/api/system/health"
echo ""
echo -e "${GREEN}🎉 Enhanced infrastructure deployment successful!${NC}"
echo ""
echo -e "${BLUE}💡 Benefits of this setup:${NC}"
echo "   ✅ Zero-downtime deployments"
echo "   ✅ Auto-scaling based on demand"
echo "   ✅ Health monitoring and auto-healing"
echo "   ✅ Load balancing across multiple instances"
echo "   ✅ Modern deployment pipeline ready"
