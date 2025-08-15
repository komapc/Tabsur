#!/bin/bash

# Multi-stage Docker build script for Tabsur
# Usage: ./build.sh [production|debug|both]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to build server
build_server() {
    local target=$1
    local tag="tabsur-server:${target}"
    
    print_status "Building server for ${target} mode..."
    docker build --target ${target} -f Dockerfile.server.multistage -t ${tag} .
    
    if [ $? -eq 0 ]; then
        print_success "Server ${target} build completed: ${tag}"
    else
        print_error "Server ${target} build failed!"
        exit 1
    fi
}

# Function to build client
build_client() {
    local target=$1
    local tag="tabsur-client:${target}"
    
    print_status "Building client for ${target} mode..."
    docker build --target ${target} -f Dockerfile.client.multistage -t ${tag} .
    
    if [ $? -eq 0 ]; then
        print_success "Client ${target} build completed: ${tag}"
    else
        print_error "Client ${target} build failed!"
        exit 1
    fi
}

# Function to build both server and client
build_both() {
    local target=$1
    print_status "Building both server and client for ${target} mode..."
    
    build_server ${target}
    build_client ${target}
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [production|debug|both]"
    echo ""
    echo "Options:"
    echo "  production  Build production images (optimized, minimal)"
    echo "  debug       Build debug images (development tools, hot reloading)"
    echo "  both        Build both production and debug images"
    echo ""
    echo "Examples:"
    echo "  $0 production    # Build only production images"
    echo "  $0 debug         # Build only debug images"
    echo "  $0 both          # Build both production and debug images"
    echo ""
    echo "Image tags:"
    echo "  Server: tabsur-server:production, tabsur-server:debug"
    echo "  Client: tabsur-client:production, tabsur-client:debug"
}

# Main script logic
case "${1:-both}" in
    "production")
        print_status "Building PRODUCTION images..."
        build_both "production"
        print_success "Production build completed!"
        ;;
    "debug")
        print_status "Building DEBUG images..."
        build_both "debug"
        print_success "Debug build completed!"
        ;;
    "both")
        print_status "Building BOTH production and debug images..."
        build_both "production"
        build_both "debug"
        print_success "All builds completed!"
        ;;
    *)
        print_error "Invalid option: $1"
        show_usage
        exit 1
        ;;
esac

# Show final status
echo ""
print_status "Build summary:"
docker images | grep tabsur | head -10
echo ""
print_success "Build process completed successfully!"
