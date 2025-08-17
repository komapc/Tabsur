#!/bin/bash

# 🚨 CRITICAL: Test Local Configuration Before Deploying
# This script MUST pass before any production deployment

set -e

echo "🚨 LOCAL TESTING REQUIRED BEFORE DEPLOYMENT"
echo "============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "${BLUE}🧪 Testing: $test_name${NC}"
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASSED: $test_name${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAILED: $test_name${NC}"
        echo "Command: $test_command"
        ((TESTS_FAILED++))
        return 1
    fi
    echo ""
}

# Function to check if port is available
check_port() {
    local port="$1"
    if netstat -tulpn 2>/dev/null | grep ":$port " > /dev/null; then
        echo -e "${RED}❌ Port $port is already in use!${NC}"
        netstat -tulpn | grep ":$port "
        return 1
    fi
    echo -e "${GREEN}✅ Port $port is available${NC}"
    return 0
}

echo -e "${YELLOW}🔍 PHASE 1: Pre-deployment Validation${NC}"
echo "============================================="

# Test 1: Validate Nginx configurations
run_test "Nginx Domain Config" "nginx -t nginx-domain.conf"
run_test "Nginx HTTPS Config" "nginx -t nginx-https-full-working.conf"
run_test "Nginx Client Config" "nginx -t nginx-client-simple.conf"

# Test 2: Validate Docker Compose files
run_test "Production Docker Compose" "docker-compose -f docker-compose-https.yml config"
run_test "Local Test Docker Compose" "docker-compose -f docker-compose-local-test.yml config"

# Test 3: Check for port conflicts
echo -e "${BLUE}🔌 Checking for port conflicts...${NC}"
check_port 80
check_port 443
check_port 5000
check_port 3000
check_port 5433
check_port 5001
check_port 3001
check_port 8080
check_port 8443
echo ""

# Test 4: Validate Docker images can build
echo -e "${BLUE}🐳 Testing Docker builds...${NC}"
run_test "Server Image Build" "docker build -f Dockerfile.server.multistage -t tabsur-server-test ."
run_test "Client Image Build" "docker build -f Dockerfile.client.multistage -t tabsur-client-test ."

# Clean up test images
docker rmi tabsur-server-test tabsur-client-test 2>/dev/null || true
echo ""

echo -e "${YELLOW}🔍 PHASE 2: Local Environment Testing${NC}"
echo "============================================="

# Test 5: Start local test environment
echo -e "${BLUE}🚀 Starting local test environment...${NC}"
docker-compose -f docker-compose-local-test.yml down 2>/dev/null || true
docker-compose -f docker-compose-local-test.yml up -d

# Wait for services to start
echo -e "${BLUE}⏳ Waiting for services to start...${NC}"
timeout 120 bash -c 'until docker-compose -f docker-compose-local-test.yml ps | grep -q "healthy"; do sleep 5; echo "Waiting..."; done'

# Test 6: Check all services are healthy
echo -e "${BLUE}🏥 Checking service health...${NC}"
if docker-compose -f docker-compose-local-test.yml ps | grep -q "unhealthy"; then
    echo -e "${RED}❌ Some services are unhealthy!${NC}"
    docker-compose -f docker-compose-local-test.yml ps
    docker-compose -f docker-compose-local-test.yml logs --tail=20
    exit 1
fi
echo -e "${GREEN}✅ All services are healthy${NC}"

# Test 7: Test health endpoints
echo -e "${BLUE}🏥 Testing health endpoints...${NC}"
run_test "Local Server Health" "curl -f http://localhost:5001/api/system/health"
run_test "Local Client Health" "curl -f http://localhost:3001/health"
run_test "Local Load Balancer Health" "curl -f http://localhost:8080/health"

# Test 8: Test main application endpoints
echo -e "${BLUE}🌐 Testing main application...${NC}"
run_test "Local Frontend" "curl -f http://localhost:8080/ --max-time 10"
run_test "Local API" "curl -f http://localhost:8080/api/system/health --max-time 10"

# Test 9: Test Nginx configuration in container
echo -e "${BLUE}🔧 Testing Nginx in container...${NC}"
run_test "Load Balancer Nginx Config" "docker exec tabsur-lb-local nginx -t"

echo -e "${YELLOW}🔍 PHASE 3: Configuration Validation${NC}"
echo "============================================="

# Test 10: Validate SSL certificate paths (if they exist)
if [ -d "ssl-test" ]; then
    echo -e "${BLUE}🔐 Testing SSL configuration...${NC}"
    run_test "SSL Certificate Paths" "test -f ssl-test/cert.pem && test -f ssl-test/key.pem"
fi

# Test 11: Validate environment variables
echo -e "${BLUE}🔧 Testing environment configuration...${NC}"
run_test "Environment File Check" "test -f .env || test -f .env.example"

echo ""
echo -e "${YELLOW}🔍 PHASE 4: Cleanup and Results${NC}"
echo "============================================="

# Stop local test environment
echo -e "${BLUE}🧹 Cleaning up local test environment...${NC}"
docker-compose -f docker-compose-local-test.yml down

# Final results
echo ""
echo -e "${BLUE}📊 TEST RESULTS SUMMARY${NC}"
echo "============================================="
echo -e "${GREEN}✅ Tests PASSED: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Tests FAILED: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo "Your configuration is ready for deployment."
    echo ""
    echo -e "${YELLOW}🚀 DEPLOYMENT CHECKLIST:${NC}"
    echo "1. ✅ Local testing completed successfully"
    echo "2. ✅ All configurations validated"
    echo "3. ✅ No port conflicts detected"
    echo "4. ✅ All services start and are healthy"
    echo "5. ✅ Health endpoints working"
    echo "6. ✅ Main application accessible"
    echo ""
    echo -e "${GREEN}You can now safely deploy to production!${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}🚨 DEPLOYMENT BLOCKED!${NC}"
    echo "Some tests failed. You MUST fix these issues before deploying."
    echo ""
    echo -e "${YELLOW}🔧 NEXT STEPS:${NC}"
    echo "1. Review the failed tests above"
    echo "2. Fix the configuration issues"
    echo "3. Run this script again: ./scripts/test-local-before-deploy.sh"
    echo "4. Only deploy when ALL tests pass"
    echo ""
    echo -e "${RED}DO NOT DEPLOY UNTIL ALL TESTS PASS!${NC}"
    exit 1
fi
