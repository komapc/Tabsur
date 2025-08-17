#!/bin/bash

# Tabsur Diagnostic and Fix Script
# Automatically detects and fixes common deployment issues

set -e

echo "🔍 Tabsur Diagnostic and Fix Script"
echo "===================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to check service status
check_services() {
    echo -e "${BLUE}📊 Checking service status...${NC}"
    
    if command -v docker-compose &> /dev/null; then
        docker-compose -f docker-compose-https.yml ps
    else
        echo -e "${RED}❌ Docker Compose not found${NC}"
        return 1
    fi
}

# Function to validate Nginx configuration
validate_nginx() {
    echo -e "${BLUE}🔧 Validating Nginx configuration...${NC}"
    
    for config in nginx-*.conf; do
        if [ -f "$config" ]; then
            echo "Checking $config..."
            if nginx -t -c "$(pwd)/$config" 2>/dev/null; then
                echo -e "${GREEN}✅ $config is valid${NC}"
            else
                echo -e "${RED}❌ $config has errors${NC}"
                echo "Errors:"
                nginx -t -c "$(pwd)/$config" 2>&1 || true
            fi
        fi
    done
}

# Function to check for port conflicts
check_ports() {
    echo -e "${BLUE}🔌 Checking for port conflicts...${NC}"
    
    for port in 80 443 5000; do
        if netstat -tulpn 2>/dev/null | grep ":$port " > /dev/null; then
            echo -e "${YELLOW}⚠️  Port $port is in use:${NC}"
            netstat -tulpn | grep ":$port "
        else
            echo -e "${GREEN}✅ Port $port is available${NC}"
        fi
    done
}

# Function to validate Docker Compose
validate_docker_compose() {
    echo -e "${BLUE}🐳 Validating Docker Compose...${NC}"
    
    if docker-compose -f docker-compose-https.yml config > /dev/null; then
        echo -e "${GREEN}✅ Docker Compose configuration is valid${NC}"
    else
        echo -e "${RED}❌ Docker Compose configuration has errors${NC}"
        docker-compose -f docker-compose-https.yml config
        return 1
    fi
}

# Function to test health endpoints
test_health_endpoints() {
    echo -e "${BLUE}🏥 Testing health endpoints...${NC}"
    
    # Test client health
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Client health endpoint working${NC}"
    else
        echo -e "${RED}❌ Client health endpoint failed${NC}"
    fi
    
    # Test server health
    if curl -f http://localhost:5000/api/system/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Server health endpoint working${NC}"
    else
        echo -e "${RED}❌ Server health endpoint failed${NC}"
    fi
}

# Function to fix common issues
fix_common_issues() {
    echo -e "${BLUE}🔧 Attempting to fix common issues...${NC}"
    
    # Stop all services
    echo "Stopping services..."
    docker-compose -f docker-compose-https.yml down 2>/dev/null || true
    
    # Remove any dangling containers
    echo "Cleaning up containers..."
    docker container prune -f 2>/dev/null || true
    
    # Restart services
    echo "Restarting services..."
    docker-compose -f docker-compose-https.yml up -d
    
    # Wait for services to start
    echo "Waiting for services to stabilize..."
    sleep 30
    
    # Check status again
    check_services
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Starting diagnostics...${NC}"
    
    # Run all checks
    validate_nginx
    echo ""
    
    validate_docker_compose
    echo ""
    
    check_ports
    echo ""
    
    check_services
    echo ""
    
    test_health_endpoints
    echo ""
    
    # Ask if user wants to attempt fixes
    echo -e "${YELLOW}🔧 Would you like to attempt automatic fixes? (y/n)${NC}"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        fix_common_issues
    else
        echo -e "${BLUE}📋 Manual fix recommendations:${NC}"
        echo "1. Check Nginx configuration syntax"
        echo "2. Verify Docker Compose file structure"
        echo "3. Ensure no port conflicts"
        echo "4. Rebuild Docker images if needed"
        echo "5. Check service logs for specific errors"
    fi
    
    echo -e "${GREEN}✅ Diagnostics complete!${NC}"
}

# Run main function
main "$@"
