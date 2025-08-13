#!/bin/bash

echo "🧪 Running BeMyGuest Tests"
echo "========================="

# Setup test environment
echo "📦 Setting up test environment..."
./test-mode.sh

# Wait for database to be fully ready
echo "⏳ Waiting for test database to be ready..."
sleep 8

# Run tests
echo "🧪 Running integration tests..."
export NODE_ENV=test
export DB_PORT=5433 
export DB_NAME=coolanu_test

# Run the tests
npm test

# Cleanup
echo "🧹 Cleaning up test environment..."
./stop-test-mode.sh

echo "✅ Tests completed!"