#!/bin/bash

# Fix DNS Script for bemyguest.dedyn.io
# This script manually sets up the DNS records

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Fix DNS Script for bemyguest.dedyn.io${NC}"
echo ""

# Configuration
DOMAIN="bemyguest.dedyn.io"
EC2_IP="3.72.76.56"
AUTH_TOKEN="yNoJQUBJAsodeSJ2pJRAZyM5fTSv"
DESEC_API="https://desec.io/api/v1/domains/${DOMAIN}/rrsets/"

echo -e "${YELLOW}🌐 Current Configuration:${NC}"
echo -e "  • Domain: ${DOMAIN}"
echo -e "  • EC2 IP: ${EC2_IP}"
echo -e "  • API: ${DESEC_API}"
echo ""

# Function to create DNS records manually
create_dns_records() {
    echo -e "${YELLOW}📝 Creating DNS records manually...${NC}"
    
    # Create A record for root domain
    echo -e "${BLUE}Creating A record for root domain...${NC}"
    curl -X POST \
        -H "Authorization: Token ${AUTH_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{\"subname\":\"\",\"type\":\"A\",\"records\":[\"${EC2_IP}\"],\"ttl\":300}" \
        "${DESEC_API}"
    
    echo ""
    
    # Create A record for api subdomain
    echo -e "${BLUE}Creating A record for api subdomain...${NC}"
    curl -X POST \
        -H "Authorization: Token ${AUTH_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{\"subname\":\"api\",\"type\":\"A\",\"records\":[\"${EC2_IP}\"],\"ttl\":300}" \
        "${DESEC_API}"
    
    echo ""
    
    # Create CNAME record for www
    echo -e "${BLUE}Creating CNAME record for www...${NC}"
    curl -X POST \
        -H "Authorization: Token ${AUTH_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{\"subname\":\"www\",\"type\":\"CNAME\",\"records\":[\"${DOMAIN}.\"],\"ttl\":300}" \
        "${DESEC_API}"
    
    echo ""
    
    # Create TXT record for verification
    echo -e "${BLUE}Creating TXT record for verification...${NC}"
    curl -X POST \
        -H "Authorization: Token ${AUTH_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{\"subname\":\"\",\"type\":\"TXT\",\"records\":[\"Tabsur App - Updated $(date -u +%Y-%m-%dT%H:%M:%SZ)\"],\"ttl\":300}" \
        "${DESEC_API}"
    
    echo ""
}

# Function to verify DNS records
verify_dns() {
    echo -e "${YELLOW}🔍 Verifying DNS records...${NC}"
    
    echo -e "${BLUE}Checking root domain...${NC}"
    dig +short ${DOMAIN}
    
    echo -e "${BLUE}Checking api subdomain...${NC}"
    dig +short api.${DOMAIN}
    
    echo -e "${BLUE}Checking www subdomain...${NC}"
    dig +short www.${DOMAIN}
    
    echo ""
}

# Function to test connectivity
test_connectivity() {
    echo -e "${YELLOW}🧪 Testing connectivity...${NC}"
    
    # Test HTTP connectivity
    echo -e "${BLUE}Testing HTTP connectivity to EC2...${NC}"
    if curl -s --connect-timeout 5 "http://${EC2_IP}:8080/health" > /dev/null; then
        echo -e "${GREEN}✅ EC2 is accessible on port 8080${NC}"
    else
        echo -e "${RED}❌ EC2 is not accessible on port 8080${NC}"
    fi
    
    # Test if nginx is running
    echo -e "${BLUE}Testing nginx on EC2...${NC}"
    if ssh -i ~/.ssh/coolanu-postgres ubuntu@${EC2_IP} "curl -s http://localhost:8080/health" > /dev/null; then
        echo -e "${GREEN}✅ Nginx is running on EC2${NC}"
    else
        echo -e "${RED}❌ Nginx is not running on EC2${NC}"
    fi
    
    echo ""
}

# Function to deploy application
deploy_application() {
    echo -e "${YELLOW}🚀 Deploying application...${NC}"
    
    # Copy configuration files
    echo -e "${BLUE}Copying configuration files...${NC}"
    scp -i ~/.ssh/coolanu-postgres docker-compose.ecr.yml ubuntu@${EC2_IP}:/opt/tabsur/
    scp -i ~/.ssh/coolanu-postgres nginx-domain.conf ubuntu@${EC2_IP}:/opt/tabsur/
    
    # Deploy on EC2
    ssh -i ~/.ssh/coolanu-postgres ubuntu@${EC2_IP} << 'EOF'
        cd /opt/tabsur
        
        # Stop existing containers
        echo "🛑 Stopping existing containers..."
        docker-compose -f docker-compose.ecr.yml down 2>/dev/null || true
        
        # Start services
        echo "🚀 Starting services..."
        docker-compose -f docker-compose.ecr.yml up -d
        
        # Check status
        echo "📊 Checking service status..."
        docker-compose -f docker-compose.ecr.yml ps
        
        echo "✅ Deployment completed!"
EOF
    
    echo ""
}

# Main execution
main() {
    echo -e "${GREEN}🎯 Starting DNS fix process...${NC}"
    echo ""
    
    # Create DNS records
    create_dns_records
    
    # Wait for DNS propagation
    echo -e "${YELLOW}⏳ Waiting 30 seconds for DNS propagation...${NC}"
    sleep 30
    
    # Verify DNS records
    verify_dns
    
    # Test connectivity
    test_connectivity
    
    # Deploy application
    deploy_application
    
    echo -e "${GREEN}🎉 DNS fix completed!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Next steps:${NC}"
    echo -e "  1. Wait 5-15 minutes for full DNS propagation"
    echo -e "  2. Test your domain: http://bemyguest.dedyn.io"
    echo -e "  3. Test API: http://api.bemyguest.dedyn.io"
    echo -e "  4. Configure SSL certificates for HTTPS"
    echo ""
    echo -e "${BLUE}🌐 Your application should be available at:${NC}"
    echo -e "  • http://bemyguest.dedyn.io"
    echo -e "  • http://api.bemyguest.dedyn.io"
    echo -e "  • http://www.bemyguest.dedyn.io"
}

# Run the script
main "$@"
