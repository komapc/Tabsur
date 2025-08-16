# 🎭 Playwright E2E Testing

## Overview
This directory contains end-to-end (E2E) tests using Playwright, a powerful browser automation framework that supports multiple browsers.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
npx playwright install
```

### Run Tests
```bash
# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test admin-panel.spec.js

# Run with UI mode
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed
```

## 📁 Test Structure

### `admin-panel.spec.js`
Comprehensive E2E tests for the admin panel:
- ✅ Panel loading and display
- ✅ Server and database status checks
- ✅ API endpoint validation
- ✅ UI responsiveness and accessibility
- ✅ Error handling and network resilience
- ✅ Mobile viewport compatibility

## 🎯 Test Categories

### 1. **UI/UX Tests**
- Page loading and rendering
- Element visibility and positioning
- Styling and layout validation
- Responsive design testing

### 2. **Functional Tests**
- Button interactions
- Form submissions
- API integrations
- Error handling

### 3. **Accessibility Tests**
- Keyboard navigation
- Screen reader compatibility
- Focus management
- ARIA compliance

### 4. **Cross-Browser Tests**
- Chrome (Chromium)
- Firefox
- Safari (WebKit)
- Mobile browsers

## 🔧 Configuration

### `playwright.config.js`
- **Test Directory**: `./tests/playwright`
- **Parallel Execution**: Enabled
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry

### Environment Variables
```bash
BASE_URL=http://localhost:3000  # Test server URL
CI=true                         # CI environment flag
```

## 🧪 Writing Tests

### Basic Test Structure
```javascript
const { test, expect } = require('@playwright/test');

test('test description', async ({ page }) => {
  // Navigate to page
  await page.goto('/');
  
  // Interact with elements
  await page.click('button');
  
  // Assert results
  await expect(page.locator('h1')).toContainText('Expected Text');
});
```

### Best Practices
1. **Use descriptive test names**
2. **Group related tests with `test.describe()`**
3. **Use `test.beforeEach()` for setup**
4. **Wait for elements to be ready**
5. **Handle async operations properly**
6. **Test error scenarios**
7. **Validate accessibility features**

## 🚨 Common Issues

### 1. **Element Not Found**
```javascript
// ❌ Bad - might fail if element isn't ready
await page.click('button');

// ✅ Good - wait for element to be ready
await page.waitForSelector('button');
await page.click('button');
```

### 2. **Timing Issues**
```javascript
// ❌ Bad - arbitrary wait
await page.waitForTimeout(2000);

// ✅ Good - wait for specific condition
await expect(page.locator('#status')).toContainText('Ready');
```

### 3. **Network Requests**
```javascript
// Mock API responses
await page.route('**/api/**', route => {
  route.fulfill({ status: 200, body: '{"status": "ok"}' });
});
```

## 📊 Test Reports

### HTML Report
```bash
npx playwright show-report
```

### JUnit Report (CI)
```bash
npx playwright test --reporter=junit
```

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
- name: Run E2E Tests
  run: npx playwright test
  env:
    BASE_URL: ${{ secrets.TEST_URL }}
```

### Docker Support
```dockerfile
# Install Playwright browsers
RUN npx playwright install-deps
RUN npx playwright install
```

## 🎨 Visual Testing

### Screenshot Comparison
```javascript
test('visual regression', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('admin-panel.png');
});
```

### Visual Studio Code Extension
Install "Playwright Test for VSCode" for:
- Test debugging
- Step-by-step execution
- Visual test results

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Test Examples](https://github.com/microsoft/playwright/tree/main/examples)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

## 🆘 Troubleshooting

### Debug Mode
```bash
# Run with debug logging
DEBUG=pw:api npx playwright test

# Run single test with debug
npx playwright test --debug admin-panel.spec.js
```

### Browser Issues
```bash
# Reinstall browsers
npx playwright install

# Install system dependencies
npx playwright install-deps
```

### Performance Issues
- Use `--workers=1` for debugging
- Enable `--headed` mode for visual debugging
- Use `--timeout=30000` for slow tests
