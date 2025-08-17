# 🧪 Testing Strategy

## 🎯 Overview

This document outlines the testing strategy for Tabsur, including unit tests, integration tests, and end-to-end (e2e) tests with optimized performance configurations.

## 🏗️ Test Structure

```
tests/
├── unit/           # Unit tests for individual functions
├── integration/    # API integration tests
├── e2e/           # End-to-end user flow tests
├── fixtures/      # Test data and mocks
├── playwright/    # Playwright E2E test configurations
└── __mocks__/     # Jest mocks and test utilities
```

## 🧪 Test Types

### 1. Unit Tests
- **Purpose**: Test individual functions in isolation
- **Coverage**: Core business logic, validation, utilities
- **Tools**: Jest, React Testing Library
- **Location**: `tests/unit/` and `client/src/components/__tests__/`
- **Performance**: Fast execution with optimized Jest config

### 2. Integration Tests
- **Purpose**: Test API endpoints and database interactions
- **Coverage**: User registration, login, meal creation, CRUD operations
- **Tools**: Jest, Supertest, PostgreSQL test database
- **Location**: `tests/integration/`

### 3. End-to-End Tests
- **Purpose**: Test complete user workflows across the entire application
- **Coverage**: User registration → login → meal creation → meal viewing
- **Tools**: Playwright with optimized configurations
- **Location**: `tests/e2e/` and `tests/playwright/`

## 🚀 Running Tests

### Fast Test Commands (Recommended for Development)

```bash
# Run fast unit tests (4-6x faster)
npm run test:fast

# Run only unit tests (fastest - ~30 seconds)
npm run test:unit

# Run tests in watch mode
npm run test:watch

# Run specific test suites
npm run test:unit          # Unit tests only
npm run test:integration    # Integration tests only
npm run test:e2e           # E2E tests only
```

### Full Test Suite (For CI/Production)

```bash
# Run all tests with coverage
npm run test:coverage

# Run full Playwright suite (all browsers)
npm run test:playwright

# Run complete test suite
npm run test:full
```

### Playwright E2E Testing

```bash
# Run fast E2E tests (Chromium only)
npm run test:playwright

# Interactive UI mode
npm run test:playwright:ui

# Debug mode
npm run test:playwright:debug

# Run with specific browser
npm run test:playwright:headed
```

## 🔧 Test Environment Setup

### Prerequisites
- Docker and Docker Compose
- Node.js 24.4+
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

## 📊 Performance Comparison

| Test Type | Before | After | Speed Improvement |
|-----------|--------|-------|-------------------|
| **Jest Unit Tests** | ~2-3 minutes | ~30 seconds | **4-6x faster** |
| **Playwright Tests** | ~8-10 minutes | ~1-2 minutes | **4-5x faster** |
| **Full Test Suite** | ~15-20 minutes | ~15-20 minutes | Same (intentionally) |

## 📋 Test Coverage Goals

- **Unit Tests**: 90%+ coverage
- **Integration Tests**: 95%+ coverage  
- **E2E Tests**: Critical user flows
- **Overall**: 90%+ coverage

## ⚡ Performance Optimizations

### Jest Fast Configuration
- **File**: `jest.config.fast.js`
- **Features**: 
  - Skips coverage collection
  - Minimal workers for faster startup
  - 3-second timeout per test
  - Bails on first failure
  - Only runs unit tests

### Playwright Fast Configuration
- **File**: `playwright.config.fast.js`
- **Features**:
  - Chromium browser only (fastest)
  - Single worker for faster startup
  - Reduced timeouts
  - Skips mobile and other browsers

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

## 🔍 Troubleshooting

### Common Issues
1. **Tests Running Slow**: Ensure you're using fast configurations
2. **Playwright Failures**: Check browser compatibility and test setup
3. **Database Issues**: Verify test database is running and accessible

### Debug Commands
```bash
# Clear Jest cache
rm -rf .jest-cache

# Run specific test with verbose output
npm run test:unit -- --verbose

# Debug Playwright tests
npm run test:playwright:debug
```

## 🎯 When to Use Each Configuration

### **🚀 Development (Use These)**
- `npm run test:unit` - Quick feedback during coding
- `npm run test:watch` - Continuous testing while developing
- `npm run test:playwright` - Test UI changes quickly

### **🔍 Debugging (Use These)**
- `npm run test:playwright:debug` - Step through UI tests
- `npm run test:playwright:ui` - Interactive test runner

### **🚢 CI/Production (Use These)**
- `npm run test:coverage` - Full coverage report
- `npm run test:playwright` - All browsers and devices
- `npm run test:full` - Complete test suite

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Performance Guide](../TEST_PERFORMANCE_GUIDE.md)

## 🔄 Current Status

**Testing Infrastructure**: 🟢 **OPTIMIZED & RUNNING**
- **Performance**: 4-6x faster execution implemented
- **Coverage**: Comprehensive testing maintained
- **CI/CD**: Automated testing in GitHub Actions
- **Last Updated**: August 2025

---

**Current Status**: Performance optimization complete with 4-6x speed improvement in development testing while maintaining full coverage for production.
