#!/bin/bash

# Tabsur Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-debug}
PROJECT_NAME="tabsur"

echo -e "${GREEN}🚀 Tabsur Deployment Script${NC}"
echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}📋 Checking prerequisites...${NC}"
    
    if ! command_exists docker; then
        echo -e "${RED}❌ Docker is not installed${NC}"
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        echo -e "${RED}❌ Docker Compose is not installed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
}

# Create necessary directories
create_directories() {
    echo -e "${YELLOW}📁 Creating directories...${NC}"
    mkdir -p logs
    mkdir -p docker/ssl
    echo -e "${GREEN}✅ Directories created${NC}"
}

# Environment-specific deployment
deploy_debug() {
    echo -e "${YELLOW}🔧 Deploying in DEBUG mode...${NC}"
    
    # Check if .env exists
    if [ ! -f .env ]; then
        echo -e "${YELLOW}⚠️  .env file not found. Creating from example...${NC}"
        cp .env.example .env
        echo -e "${RED}⚠️  Please edit .env file with your configuration before continuing${NC}"
        echo -e "${YELLOW}Press any key to continue after editing .env...${NC}"
        read -n 1 -s
    fi
    
    # Build and start services
    echo -e "${YELLOW}🏗️  Building and starting services...${NC}"
    docker-compose -f docker-compose.debug.yml down --remove-orphans
    docker-compose -f docker-compose.debug.yml build --no-cache
    docker-compose -f docker-compose.debug.yml up -d
    
    # Wait for services to be healthy
    echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
    sleep 30
    
    # Check service health
    check_service_health "debug"
}

deploy_release() {
    echo -e "${YELLOW}🚀 Deploying in RELEASE mode...${NC}"
    
    # Environment validation for production
    if [ -z "$DB_HOST" ] || [ -z "$JWT_SECRET" ]; then
        echo -e "${RED}❌ Required production environment variables are missing${NC}"
        echo -e "${YELLOW}Please set: DB_HOST, JWT_SECRET, and other production variables${NC}"
        exit 1
    fi
    
    # Build and start services
    echo -e "${YELLOW}🏗️  Building and starting services...${NC}"
    docker-compose -f docker-compose.release.yml down --remove-orphans
    docker-compose -f docker-compose.release.yml build --no-cache
    docker-compose -f docker-compose.release.yml up -d
    
    # Wait for services to be healthy
    echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
    sleep 45
    
    # Check service health
    check_service_health "release"
}

# Check service health
check_service_health() {
    local mode=$1
    echo -e "${YELLOW}🏥 Checking service health...${NC}"
    
    # Check server health
    for i in {1..10}; do
        if curl -f http://localhost:5000/api/system/health >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Server is healthy${NC}"
            break
        else
            echo -e "${YELLOW}⏳ Waiting for server... (attempt $i/10)${NC}"
            sleep 5
        fi
        
        if [ $i -eq 10 ]; then
            echo -e "${RED}❌ Server health check failed${NC}"
            show_logs
            exit 1
        fi
    done
    
    # Check client health (only in debug mode)
    if [ "$mode" = "debug" ]; then
        for i in {1..5}; do
            if curl -f http://localhost:3000/health >/dev/null 2>&1; then
                echo -e "${GREEN}✅ Client is healthy${NC}"
                break
            else
                echo -e "${YELLOW}⏳ Waiting for client... (attempt $i/5)${NC}"
                sleep 3
            fi
        done
    fi
}

# Show logs for debugging
show_logs() {
    echo -e "${RED}📄 Recent logs:${NC}"
    if [ "$ENVIRONMENT" = "debug" ]; then
        docker-compose -f docker-compose.debug.yml logs --tail=50
    else
        docker-compose -f docker-compose.release.yml logs --tail=50
    fi
}

# Cleanup function
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up...${NC}"
    
    if [ "$ENVIRONMENT" = "debug" ]; then
        docker-compose -f docker-compose.debug.yml down --remove-orphans
    else
        docker-compose -f docker-compose.release.yml down --remove-orphans
    fi
    
    # Clean up dangling images
    docker image prune -f
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Show deployment info
show_info() {
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${YELLOW}📊 Service Information:${NC}"
    
    if [ "$ENVIRONMENT" = "debug" ]; then
        echo -e "${GREEN}🌐 Client: http://localhost:3000${NC}"
        echo -e "${GREEN}🔧 Server: http://localhost:5000${NC}"
        echo -e "${GREEN}🗄️  Database: localhost:5432${NC}"
        echo -e "${GREEN}📝 Redis: Not used${NC}"
    else
        echo -e "${GREEN}🌐 Application: http://localhost${NC}"
        echo -e "${GREEN}🔧 API: http://localhost:5000${NC}"
        echo -e "${GREEN}⚖️  Load Balancer: http://localhost:8080${NC}"
    fi
    
    echo -e "${YELLOW}📄 Useful commands:${NC}"
    echo -e "  View logs: ./deploy.sh logs"
    echo -e "  Stop services: ./deploy.sh stop"
    echo -e "  Restart: ./deploy.sh restart"
}

# Main deployment logic
case "$1" in
    "debug"|"")
        ENVIRONMENT="debug"
        check_prerequisites
        create_directories
        deploy_debug
        show_info
        ;;
    "release"|"prod"|"production")
        ENVIRONMENT="release"
        check_prerequisites
        create_directories
        deploy_release
        show_info
        ;;
    "logs")
        show_logs
        ;;
    "stop")
        cleanup
        ;;
    "restart")
        cleanup
        sleep 5
        if [ "$2" = "release" ] || [ "$2" = "prod" ]; then
            deploy_release
        else
            deploy_debug
        fi
        show_info
        ;;
    "test")
        echo -e "${YELLOW}🧪 Running tests...${NC}"
        npm test
        cd client && npm test
        echo -e "${GREEN}✅ Tests completed${NC}"
        ;;
    *)
        echo -e "${YELLOW}Usage: $0 {debug|release|logs|stop|restart|test}${NC}"
        echo -e "${YELLOW}  debug    - Deploy in development mode (default)${NC}"
        echo -e "${YELLOW}  release  - Deploy in production mode${NC}"
        echo -e "${YELLOW}  logs     - Show recent logs${NC}"
        echo -e "${YELLOW}  stop     - Stop all services${NC}"
        echo -e "${YELLOW}  restart  - Restart services${NC}"
        echo -e "${YELLOW}  test     - Run test suite${NC}"
        exit 1
        ;;
esac