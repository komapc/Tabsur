# 🧪 Testing Strategy

## 🎯 Overview

This document outlines the testing strategy for Tabsur, including unit tests, integration tests, and end-to-end (e2e) tests.

## 🏗️ Test Structure

```
tests/
├── unit/           # Unit tests for individual functions
├── integration/    # API integration tests
├── e2e/           # End-to-end user flow tests
└── fixtures/      # Test data and mocks
```

## 🧪 Test Types

### 1. Unit Tests
- **Purpose**: Test individual functions in isolation
- **Coverage**: Core business logic, validation, utilities
- **Tools**: Jest, React Testing Library
- **Location**: `tests/unit/` and `client/src/components/__tests__/`

### 2. Integration Tests
- **Purpose**: Test API endpoints and database interactions
- **Coverage**: User registration, login, meal creation, CRUD operations
- **Tools**: Jest, Supertest, PostgreSQL test database
- **Location**: `tests/integration/`

### 3. End-to-End Tests
- **Purpose**: Test complete user workflows across the entire application
- **Coverage**: User registration → login → meal creation → meal viewing
- **Tools**: Playwright, Docker Compose
- **Location**: `tests/e2e/`

## 🚀 Running Tests

### Quick Test Commands

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit          # Unit tests only
npm run test:integration    # Integration tests only
npm run test:e2e           # E2E tests only

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests on specific environments
npm run test:debug         # Debug environment
npm run test:release       # Release environment
```

### Environment-Specific Testing

```bash
# Test on debug environment
npm run test:debug

# Test on release environment  
npm run test:release

# Test on production (read-only)
npm run test:prod
```

## 🔧 Test Environment Setup

### Prerequisites
- Docker and Docker Compose
- Node.js 18+
- PostgreSQL client tools

### Local Test Database
```bash
# Start test database
npm run test:db:start

# Stop test database
npm run test:db:stop

# Reset test database
npm run test:db:reset
```

## 📋 Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: 90%+ coverage  
- **E2E Tests**: Critical user flows
- **Overall**: 85%+ coverage

## 🧹 Test Maintenance

### Before Each Release
1. Run full test suite
2. Update test data if API changes
3. Verify e2e tests pass on both debug and release
4. Update test documentation

### Test Data Management
- Use fixtures for consistent test data
- Clean up test data after each test
- Use unique identifiers to avoid conflicts
