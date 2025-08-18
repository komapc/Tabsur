#!/bin/bash

# Fast Docker Build Script for Tabsur
# This script builds Docker images with optimizations for speed

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Fast Docker Build Script${NC}"
echo ""

# Configuration
ECR_REGISTRY="272007598366.dkr.ecr.eu-central-1.amazonaws.com"
REGION="eu-central-1"
BUILDKIT_ENABLED=1

# Enable BuildKit for faster builds
export DOCKER_BUILDKIT=$BUILDKIT_ENABLED
export COMPOSE_DOCKER_CLI_BUILD=$BUILDKIT_ENABLED

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running${NC}"
        exit 1
    fi
    
    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI is not installed${NC}"
        exit 1
    fi
    
    # Check if we're logged into ECR
    if ! docker pull $ECR_REGISTRY/tabsur-server:latest > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Not logged into ECR, logging in now...${NC}"
        aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
    fi
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
    echo ""
}

# Function to build server image
build_server() {
    echo -e "${YELLOW}🐳 Building server image...${NC}"
    
    # Build with optimizations
    docker build \
        --target production \
        --cache-from $ECR_REGISTRY/tabsur-server:latest \
        --build-arg BUILDKIT_INLINE_CACHE=1 \
        -t tabsur-server:latest \
        -t $ECR_REGISTRY/tabsur-server:latest \
        -f Dockerfile.server.multistage \
        .
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ Server image built successfully${NC}"
    else
        echo -e "${RED}❌ Server image build failed${NC}"
        exit 1
    fi
}

# Function to build client image
build_client() {
    echo -e "${YELLOW}🐳 Building client image...${NC}"
    
    # Build with optimizations
    docker build \
        --target production \
        --cache-from $ECR_REGISTRY/tabsur-client:latest \
        --build-arg BUILDKIT_INLINE_CACHE=1 \
        --build-arg REACT_APP_SERVER_HOST="https://bemyguest.dedyn.io" \
        --build-arg REACT_APP_API_URL="https://bemyguest.dedyn.io" \
        --build-arg APP_BUILD_ID="$(date +%Y%m%d%H%M%S)" \
        -t tabsur-client:latest \
        -t $ECR_REGISTRY/tabsur-client:latest \
        -f Dockerfile.client.multistage \
        .
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ Client image built successfully${NC}"
    else
        echo -e "${RED}❌ Client image build failed${NC}"
        exit 1
    fi
}

# Function to build images in parallel
build_parallel() {
    echo -e "${YELLOW}🚀 Building images in parallel...${NC}"
    
    # Start both builds in background
    build_server &
    SERVER_PID=$!
    
    build_client &
    CLIENT_PID=$!
    
    # Wait for both builds to complete
    wait $SERVER_PID
    SERVER_EXIT=$?
    
    wait $CLIENT_PID
    CLIENT_EXIT=$?
    
    # Check results
    if [[ $SERVER_EXIT -eq 0 && $CLIENT_EXIT -eq 0 ]]; then
        echo -e "${GREEN}✅ All images built successfully${NC}"
    else
        echo -e "${RED}❌ Some builds failed${NC}"
        exit 1
    fi
    
    echo ""
}

# Function to push images
push_images() {
    echo -e "${YELLOW}📤 Pushing images to ECR...${NC}"
    
    # Push server image
    echo -e "${BLUE}Pushing server image...${NC}"
    docker push $ECR_REGISTRY/tabsur-server:latest &
    SERVER_PUSH_PID=$!
    
    # Push client image
    echo -e "${BLUE}Pushing client image...${NC}"
    docker push $ECR_REGISTRY/tabsur-client:latest &
    CLIENT_PUSH_PID=$!
    
    # Wait for both pushes to complete
    wait $SERVER_PUSH_PID
    wait $CLIENT_PUSH_PID
    
    echo -e "${GREEN}✅ All images pushed successfully${NC}"
    echo ""
}

# Function to show build statistics
show_stats() {
    echo -e "${YELLOW}📊 Build Statistics${NC}"
    
    # Show image sizes
    echo -e "${BLUE}Image sizes:${NC}"
    docker images | grep -E "(tabsur-server|tabsur-client)" | awk '{print $1, $2, $5}'
    
    # Show build cache usage
    echo -e "${BLUE}Build cache usage:${NC}"
    docker system df
}

# Main execution
main() {
    local start_time=$(date +%s)
    
    echo -e "${GREEN}🎯 Starting fast Docker build process...${NC}"
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Build images in parallel
    build_parallel
    
    # Push images
    push_images
    
    # Show statistics
    show_stats
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    echo -e "${GREEN}🎉 Fast build completed in ${duration} seconds!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Next steps:${NC}"
    echo -e "  1. Deploy to EC2: ./scripts/deploy-domain.sh"
    echo -e "  2. Test the application"
    echo -e "  3. Monitor logs for any issues"
}

# Run the script
main "$@"
