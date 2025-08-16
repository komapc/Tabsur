#!/bin/bash

echo "🚀 Running Ultra-Fast Tests..."

# Set environment for fast testing
export NODE_ENV=test
export JEST_WORKERS=8
export JEST_TIMEOUT=3000

# Run only the fastest tests
echo "🧪 Running minimal test suite..."
jest --config jest.config.fast.js --passWithNoTests --verbose=false --maxWorkers=8 --testTimeout=3000

echo "✅ Fast tests completed!"
