#!/bin/bash

echo "🛑 Stopping BeMyGuest TEST MODE"
echo "==============================="

# Kill any running processes
pkill -f "node\|nodemon\|react-scripts" || true

# Stop test database
echo "🗄️  Stopping test database..."
docker-compose -p coolanu-test-db -f db/test-docker-compose.yaml down

echo "✅ Test environment stopped!"