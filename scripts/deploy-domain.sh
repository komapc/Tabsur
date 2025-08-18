#!/bin/bash

# Domain Deployment Script for bemyguest.dedyn.io
# This script deploys the application with domain configuration

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Tabsur Domain Deployment Script${NC}"
echo -e "${YELLOW}Domain: bemyguest.dedyn.io${NC}"
echo -e "${YELLOW}API Server: api.bemyguest.dedyn.io${NC}"
echo ""

# Check if required files exist
check_requirements() {
    echo -e "${YELLOW}🔍 Checking requirements...${NC}"
    
    local required_files=(
        "docker-compose.ecr.yml"
        "nginx-domain.conf"
        "env.domain"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            echo -e "${RED}❌ Missing required file: $file${NC}"
            exit 1
        else
            echo -e "${GREEN}✅ Found: $file${NC}"
        fi
    done
    
    echo ""
}

# Update DNS records
update_dns() {
    echo -e "${YELLOW}🌐 Updating DNS records...${NC}"
    
    if [[ -f "scripts/update-desec-dns.sh" ]]; then
        chmod +x scripts/update-desec-dns.sh
        ./scripts/update-desec-dns.sh
        
        if [[ $? -eq 0 ]]; then
            echo -e "${GREEN}✅ DNS update completed successfully${NC}"
        else
            echo -e "${RED}❌ DNS update failed${NC}"
            echo -e "${YELLOW}⚠️  Continuing with deployment...${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  DNS update script not found, skipping DNS update step${NC}"
    fi
    
    echo ""
}

# Build and push Docker images
build_images() {
    echo -e "${YELLOW}🐳 Building and pushing Docker images...${NC}"
    
    # Get AWS account ID and region from ECR registry
    local ecr_registry="272007598366.dkr.ecr.eu-central-1.amazonaws.com"
    local region="eu-central-1"
    
    echo -e "${BLUE}Logging into ECR...${NC}"
    aws ecr get-login-password --region $region | docker login --username AWS --password-stdin $ecr_registry
    
    if [[ $? -ne 0 ]]; then
        echo -e "${RED}❌ Failed to login to ECR${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Building server image...${NC}"
    docker build -f Dockerfile.server.multistage -t $ecr_registry/tabsur-server:latest .
    
    echo -e "${BLUE}Building client image...${NC}"
    docker build -f Dockerfile.client.multistage -t $ecr_registry/tabsur-client:latest .
    
    echo -e "${BLUE}Pushing server image...${NC}"
    docker push $ecr_registry/tabsur-server:latest
    
    echo -e "${BLUE}Pushing client image...${NC}"
    docker push $ecr_registry/tabsur-client:latest
    
    echo -e "${GREEN}✅ Docker images built and pushed successfully${NC}"
    echo ""
}

# Deploy to EC2
deploy_to_ec2() {
    echo -e "${YELLOW}☁️  Deploying to EC2...${NC}"
    
    # Check if SSH key exists
    if [[ ! -f ~/.ssh/coolanu-postgres ]]; then
        echo -e "${RED}❌ SSH key not found at ~/.ssh/coolanu-postgres${NC}"
        echo -e "${YELLOW}Please ensure your SSH key is available${NC}"
        exit 1
    fi
    
    # Get EC2 public IP from ec2-config.env if present, else fallback
    local ec2_ip=""
    if [[ -f "ec2-config.env" ]]; then
        # shellcheck disable=SC1091
        source ec2-config.env
        ec2_ip="$EC2_PUBLIC_IP"
    fi
    if [[ -z "$ec2_ip" ]]; then
        ec2_ip="3.72.76.56"
    fi
    
    echo -e "${BLUE}📤 Copying configuration files to EC2...${NC}"
    
    # Copy files to EC2
    scp -i ~/.ssh/coolanu-postgres docker-compose.ecr.yml ubuntu@$ec2_ip:/opt/tabsur/
    scp -i ~/.ssh/coolanu-postgres nginx-domain.conf ubuntu@$ec2_ip:/opt/tabsur/
    scp -i ~/.ssh/coolanu-postgres env.domain ubuntu@$ec2_ip:/opt/tabsur/
    
    echo -e "${BLUE}🚀 Deploying on EC2...${NC}"
    
    # Deploy on EC2
    ssh -i ~/.ssh/coolanu-postgres ubuntu@$ec2_ip << 'EOF'
        cd /opt/tabsur
        
        # Stop existing containers
        echo "🛑 Stopping existing containers..."
        docker-compose -f docker-compose.ecr.yml down
        
        # Pull latest images
        echo "📥 Pulling latest images..."
        docker-compose -f docker-compose.ecr.yml pull
        
        # Start services with new configuration
        echo "🚀 Starting services..."
        docker-compose -f docker-compose.ecr.yml up -d
        
        # Check status
        echo "📊 Checking service status..."
        docker-compose -f docker-compose.ecr.yml ps
        
        echo "✅ Deployment completed!"
EOF
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ Deployment completed successfully${NC}"
    else
        echo -e "${RED}❌ Deployment failed${NC}"
        exit 1
    fi
    
    echo ""
}

# Test deployment
test_deployment() {
    echo -e "${YELLOW}🧪 Testing deployment...${NC}"
    
    local domain="bemyguest.dedyn.io"
    local api_domain="api.bemyguest.dedyn.io"
    
    echo -e "${BLUE}Testing main domain...${NC}"
    if curl -s -f "https://$domain/health" > /dev/null; then
        echo -e "${GREEN}✅ Main domain is accessible${NC}"
    else
        echo -e "${RED}❌ Main domain is not accessible${NC}"
    fi
    
    echo -e "${BLUE}Testing API domain...${NC}"
    if curl -s -f "https://$api_domain/health" > /dev/null; then
        echo -e "${GREEN}✅ API domain is accessible${NC}"
    else
        echo -e "${RED}❌ API domain is not accessible${NC}"
    fi
    
    echo ""
}

# Main execution
main() {
    echo -e "${GREEN}🎯 Starting domain deployment process...${NC}"
    echo ""
    
    # Check requirements
    check_requirements
    
    # Update DNS
    update_dns
    
    # Build and push images
    build_images
    
    # Deploy to EC2
    deploy_to_ec2
    
    # Test deployment
    test_deployment
    
    echo -e "${GREEN}🎉 Domain deployment completed!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Next steps:${NC}"
    echo -e "  1. Configure SSL certificates for HTTPS"
    echo -e "  2. Update your Google Maps API key"
    echo -e "  3. Test all application features"
    echo -e "  4. Monitor logs for any issues"
    echo ""
    echo -e "${BLUE}🌐 Your application is now available at:${NC}"
    echo -e "  • Frontend: https://$domain"
    echo -e "  • API: https://$api_domain"
    echo ""
}

# Run the script
main "$@"
