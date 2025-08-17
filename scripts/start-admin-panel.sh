#!/bin/bash

# Start Admin Panel with HTTPS Support
# This script sets up and starts the complete admin panel environment

set -e

echo "🚀 Starting Tabsur Admin Panel..."

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install it first."
    exit 1
fi

# Check if OpenSSL is available
if ! command -v openssl &> /dev/null; then
    print_error "OpenSSL is not installed. Please install it first."
    exit 1
fi

print_status "Checking prerequisites..."

# Create necessary directories
mkdir -p logs/nginx
mkdir -p ssl

# Setup SSL certificates
print_status "Setting up SSL certificates..."
if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
    ./scripts/setup-ssl-dev.sh
else
    print_success "SSL certificates already exist"
fi

# Check if containers are already running
if docker-compose -f docker-compose-admin.yml ps | grep -q "Up"; then
    print_warning "Some containers are already running. Stopping them first..."
    docker-compose -f docker-compose-admin.yml down
fi

# Start the admin panel
print_status "Starting admin panel services..."
docker-compose -f docker-compose-admin.yml up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."

# Check EC2 database connection
print_status "Checking EC2 database connection..."
until curl -f "http://localhost:5000/health" > /dev/null 2>&1; do
    sleep 3
done
print_success "EC2 database connection verified"

# Wait for server
print_status "Waiting for backend server..."
until curl -f http://localhost:5000/health > /dev/null 2>&1; do
    sleep 3
done
print_success "Backend server is ready"

# Wait for client
print_status "Waiting for frontend client..."
until curl -f http://localhost:3000 > /dev/null 2>&1; do
    sleep 3
done
print_success "Frontend client is ready"

# Wait for nginx
print_status "Waiting for Nginx..."
until curl -f http://localhost:80 > /dev/null 2>&1; do
    sleep 2
done
print_success "Nginx is ready"

# Check HTTPS
print_status "Testing HTTPS..."
if curl -k -f https://localhost:443 > /dev/null 2>&1; then
    print_success "HTTPS is working"
else
    print_warning "HTTPS might not be working yet, retrying..."
    sleep 5
    if curl -k -f https://localhost:443 > /dev/null 2>&1; then
        print_success "HTTPS is now working"
    else
        print_warning "HTTPS setup might need manual verification"
    fi
fi

# Show service status
print_status "Service status:"
docker-compose -f docker-compose-admin.yml ps

echo ""
print_success "🎉 Admin Panel is now running!"
echo ""
echo "🌐 Access your services:"
echo "   🔐 Admin Panel:     https://localhost/admin"
echo "   🖥️  Frontend:        https://localhost:3000"
echo "   ⚙️  Backend API:     https://localhost:5000"
echo "   🗄️  PgAdmin:         http://localhost:5050"
echo "   📊 Health Check:     https://localhost/health"
echo ""
echo "🔑 PgAdmin credentials:"
echo "   Email:    admin@tabsur.com"
echo "   Password: admin123"
echo ""
echo "📋 Useful commands:"
echo "   View logs:           docker-compose -f docker-compose-admin.yml logs -f"
echo "   Stop services:       docker-compose -f docker-compose-admin.yml down"
echo "   Restart services:    docker-compose -f docker-compose-admin.yml restart"
echo "   View status:         docker-compose -f docker-compose-admin.yml ps"
echo ""
echo "⚠️  Note: Your browser will show a security warning for the self-signed certificate."
echo "   This is normal for development. Click 'Advanced' -> 'Proceed to localhost (unsafe)'."
echo ""
print_success "Admin Panel startup complete! 🚀"
