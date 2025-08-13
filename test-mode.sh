#!/bin/bash

echo "🧪 Starting BeMyGuest in TEST MODE"
echo "================================="

# Set test environment variables
export NODE_ENV=test
export DB_NAME=coolanu_test
export DB_USER=coolanu
export DB_PASSWORD=coolanu
export DB_HOST=localhost
export DB_PORT=5432

# Create test database docker compose
cat > db/test-docker-compose.yaml << EOF
version: '3.8'

services:
  coolanu-test-db:
    image: postgres:12.2
    ports:
      - "5433:5432"
    environment:
      POSTGRES_USER: coolanu
      POSTGRES_PASSWORD: coolanu
      POSTGRES_DB: coolanu_test
    volumes:
      - test_db_data:/var/lib/postgresql/data

volumes:
  test_db_data:
EOF

echo "📦 Starting test database..."
docker-compose -p coolanu-test-db -f db/test-docker-compose.yaml up -d

echo "⏳ Waiting for database to be ready..."
sleep 5

echo "🗄️  Running database migrations for test..."
cd db
PGPASSWORD=coolanu DB_HOST=localhost DB_PORT=5433 DB_NAME=coolanu_test bash ./migrate.sh
cd ..

echo "📦 Installing dependencies..."
npm install > /dev/null 2>&1
cd client && npm install > /dev/null 2>&1 && cd ..

echo "🧪 Test environment ready!"
echo ""
echo "Database running on port 5433"
echo "Server will run on port 5000"
echo "Client will run on port 3000"
echo ""
echo "To stop test environment: ./stop-test-mode.sh"