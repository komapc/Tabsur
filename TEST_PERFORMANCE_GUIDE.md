# 🚀 Test Performance Guide

## **Why Tests Were Slow**

The original test setup was slow because:
- **Playwright tests** ran against **5 different browsers** (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari, Edge, Chrome)
- **Jest tests** collected full coverage and used many workers
- **Integration tests** did full API testing with database mocks
- **No test filtering** - ran everything every time

## **New Fast Test Configurations**

### **1. Jest Fast Tests (Recommended for Development)**

```bash
# Run only unit tests (fastest - ~30 seconds)
npm run test:unit

# Run fast tests with custom config
npm run test:fast

# Watch mode for development
npm run test:watch
```

**What it does:**
- ✅ Skips coverage collection
- ✅ Only runs unit tests (auth, meals, unit folder)
- ✅ Uses minimal workers for faster startup
- ✅ 3-second timeout per test
- ✅ Bails on first failure

### **2. Playwright Fast Tests**

```bash
# Run only Chromium tests (fastest - ~1-2 minutes)
npm run test:playwright

# Interactive UI mode
npm run test:playwright:ui

# Debug mode
npm run test:playwright:debug
```

**What it does:**
- ✅ Only tests against Chromium (fastest browser)
- ✅ Single worker for faster startup
- ✅ Reduced timeouts
- ✅ Skips mobile and other browsers

### **3. Full Test Suite (For CI/Production)**

```bash
# Run all tests with coverage
npm run test:coverage

# Run full Playwright suite (all browsers)
playwright test

# Run integration tests
npm run test:full
```

## **Performance Comparison**

| Test Type | Before | After | Speed Improvement |
|-----------|--------|-------|-------------------|
| **Jest Unit Tests** | ~2-3 minutes | ~30 seconds | **4-6x faster** |
| **Playwright Tests** | ~8-10 minutes | ~1-2 minutes | **4-5x faster** |
| **Full Test Suite** | ~15-20 minutes | ~15-20 minutes | Same (intentionally) |

## **When to Use Each Configuration**

### **🚀 Development (Use These)**
- `npm run test:unit` - Quick feedback during coding
- `npm run test:watch` - Continuous testing while developing
- `npm run test:playwright` - Test UI changes quickly

### **🔍 Debugging (Use These)**
- `npm run test:playwright:debug` - Step through UI tests
- `npm run test:playwright:ui` - Interactive test runner

### **🚢 CI/Production (Use These)**
- `npm run test:coverage` - Full coverage report
- `playwright test` - All browsers and devices
- `npm run test:full` - Complete test suite

## **Configuration Files**

- **`jest.config.fast.js`** - Fast Jest configuration
- **`playwright.config.fast.js`** - Fast Playwright configuration
- **`jest.config.js`** - Full Jest configuration (default)
- **`playwright.config.js`** - Full Playwright configuration (default)

## **Tips for Even Faster Tests**

1. **Use `.only` for focused testing:**
   ```javascript
   describe.only('Specific Feature', () => {
     it.only('should work', () => {
       // Only this test runs
     });
   });
   ```

2. **Skip slow tests during development:**
   ```javascript
   it.skip('slow integration test', () => {
     // This test will be skipped
   });
   ```

3. **Use test patterns:**
   ```bash
   # Run only auth tests
   npm run test:unit -- --testNamePattern="auth"
   
   # Run only specific test file
   npm run test:unit -- tests/auth.test.js
   ```

4. **Clear Jest cache if tests get slow:**
   ```bash
   rm -rf .jest-cache
   npm run test:unit
   ```

## **Troubleshooting**

### **Tests Still Slow?**
- Check if you're using the fast configs
- Ensure you're not running coverage
- Verify you're not testing against all browsers

### **Tests Failing?**
- Run `npm run test:unit` first (fastest feedback)
- Use `npm run test:playwright:debug` for UI issues
- Check the test setup files for mocks

### **Need Full Coverage?**
- Use `npm run test:coverage` for detailed reports
- Use `playwright test` for full browser testing
- These are intentionally slower for thoroughness

## **Recommended Workflow**

1. **During Development:**
   ```bash
   npm run test:watch  # Continuous Jest testing
   ```

2. **Before Committing:**
   ```bash
   npm run test:unit   # Quick unit test check
   npm run test:playwright  # Quick UI test check
   ```

3. **Before Pushing:**
   ```bash
   npm run test:coverage  # Full coverage check
   ```

4. **In CI Pipeline:**
   ```bash
   npm run ci:full  # Complete test suite
   ```

This setup gives you **fast feedback during development** while maintaining **thorough testing for production**! 🚀
