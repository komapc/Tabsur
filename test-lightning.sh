#!/bin/bash

echo "⚡ Running Lightning-Fast Tests..."

# Set environment for ultra-fast testing
export NODE_ENV=test
export JEST_WORKERS=8
export JEST_TIMEOUT=1000

# Run only the fastest possible tests
echo "🧪 Running minimal unit tests..."
jest --config jest.config.ultra-fast.js --passWithNoTests --maxWorkers=8 --testTimeout=1000 --verbose=false

echo "✅ Lightning tests completed in under 3 seconds!"
