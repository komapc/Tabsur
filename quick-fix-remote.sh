#!/bin/bash

# Quick Fix Script for Remote Server
# Run this on the remote server to fix deployment issues

set -e

echo "🔧 Quick Fix Script for Remote Server"
echo "====================================="

# Navigate to project directory
cd /home/ubuntu/Tabsur

# Backup current environment
if [ -f .env ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Current .env backed up"
fi

# Copy new environment template
if [ -f .env.remote ]; then
    cp .env.remote .env
    echo "✅ New environment template copied"
else
    echo "❌ .env.remote not found. Please copy it manually."
    exit 1
fi

# Stop current services
echo "🛑 Stopping current services..."
docker-compose -f docker-compose.ecr.yml down || true

# Pull latest images
echo "📥 Pulling latest images..."
docker-compose -f docker-compose.ecr.yml pull

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.ecr.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service status
echo "📊 Checking service status..."
docker-compose -f docker-compose.ecr.yml ps

# Test endpoints
echo "🧪 Testing endpoints..."
if curl -k -s https://bemyguest.dedyn.io/health > /dev/null; then
    echo "✅ Health endpoint working"
else
    echo "❌ Health endpoint failed"
fi

echo "🎉 Quick fix completed!"
echo "⚠️  IMPORTANT: You still need to edit .env with your actual API keys!"
echo "   Run: nano .env"
