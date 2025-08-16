# 🎭 Playwright E2E Tests

This directory contains end-to-end tests using Playwright for the Tabsur application.

## 🚀 Quick Start

### Install Dependencies
```bash
npm run test:playwright:install-deps
```

### Install Browsers
```bash
npm run test:playwright:install
```

### Run Tests
```bash
# Run all tests
npm run test:playwright

# Run with UI
npm run test:playwright:ui

# Run in headed mode (visible browser)
npm run test:playwright:headed

# Run in debug mode
npm run test:playwright:debug

# Show test report
npm run test:playwright:report
```

## 📁 Test Structure

- `admin-panel.spec.js` - Admin panel functionality tests
- More test files will be added for other features

## 🔧 Configuration

The tests are configured in `playwright.config.js` with:
- Multiple browser support (Chrome, Firefox, Safari)
- Mobile viewport testing
- Screenshot and video capture on failure
- CI/CD optimized settings

## 🎯 Test Coverage

Current tests cover:
- ✅ Admin panel loading
- ✅ User statistics display
- ✅ Responsive design
- ✅ Navigation functionality
- ✅ Meta tag validation

## 🚦 CI/CD Integration

These tests are integrated into the GitHub Actions workflow and will run automatically on:
- Pull requests
- Push to main/master
- Manual workflow triggers

## 🐛 Debugging

For debugging test failures:
1. Run `npm run test:playwright:debug` for step-by-step debugging
2. Check screenshots and videos in `test-results/` directory
3. Use `npm run test:playwright:report` to view detailed HTML reports
