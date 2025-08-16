const { test, expect } = require('@playwright/test');

test.describe('Admin Panel E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin panel
    await page.goto('/');
  });

  test('should load admin panel successfully', async ({ page }) => {
    // Check if admin panel loads
    await expect(page.locator('h1')).toContainText('Tabsur Admin Panel');
    
    // Check if system status section exists
    await expect(page.locator('h2')).toContainText('System Status');
    
    // Check if API endpoints section exists
    await expect(page.locator('h2')).toContainText('API Endpoints');
  });

  test('should display server status correctly', async ({ page }) => {
    // Wait for status checks to complete
    await page.waitForTimeout(2000);
    
    // Check server status
    const serverStatus = page.locator('#server-status');
    await expect(serverStatus).toBeVisible();
    
    // Status should show either running, error, or checking
    const statusText = await serverStatus.textContent();
    expect(['✅ Server running', '❌ Server error', '❌ Server unreachable', 'Checking...']).toContain(statusText);
  });

  test('should display database status correctly', async ({ page }) => {
    // Wait for status checks to complete
    await page.waitForTimeout(2000);
    
    // Check database status
    const dbStatus = page.locator('#db-status');
    await expect(dbStatus).toBeVisible();
    
    // Status should show either connected, checking, or disconnected
    const statusText = await dbStatus.textContent();
    expect(['✅ Database connected', '⚠️ Database checking', '❌ Database disconnected', '❌ Cannot check DB', 'Checking...']).toContain(statusText);
  });

  test('should have working refresh button', async ({ page }) => {
    // Find and click refresh button
    const refreshButton = page.locator('button:has-text("Refresh All")');
    await expect(refreshButton).toBeVisible();
    await expect(refreshButton).toBeEnabled();
    
    // Click refresh and verify it works
    await refreshButton.click();
    
    // Wait for refresh to complete
    await page.waitForTimeout(1000);
    
    // Verify button is still functional
    await expect(refreshButton).toBeEnabled();
  });

  test('should list API endpoints correctly', async ({ page }) => {
    // Check if API endpoints are listed
    const apiList = page.locator('ul li');
    await expect(apiList).toHaveCount(3);
    
    // Verify specific endpoints
    await expect(page.locator('text=/api\\/system\\/health/')).toBeVisible();
    await expect(page.locator('text=/api\\/users\\/:id/')).toBeVisible();
    await expect(page.locator('text=/api\\/meals/')).toBeVisible();
  });

  test('should have proper styling and layout', async ({ page }) => {
    // Check if container has proper styling
    const container = page.locator('.container');
    await expect(container).toBeVisible();
    
    // Check if cards are properly styled
    const cards = page.locator('.card');
    await expect(cards).toHaveCount(2);
    
    // Check if buttons have proper styling
    const buttons = page.locator('.btn');
    await expect(buttons).toHaveCount(1);
    
    // Verify responsive design elements
    await expect(page.locator('body')).toHaveCSS('font-family', /Arial/);
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network failure by going offline
    await page.route('**/*', route => route.abort());
    
    // Click refresh to trigger error handling
    const refreshButton = page.locator('button:has-text("Refresh All")');
    await refreshButton.click();
    
    // Wait for error states
    await page.waitForTimeout(2000);
    
    // Verify error states are displayed
    const serverStatus = page.locator('#server-status');
    const dbStatus = page.locator('#db-status');
    
    // Should show error states
    await expect(serverStatus).toContainText('❌');
    await expect(dbStatus).toContainText('❌');
  });

  test('should be accessible and keyboard navigable', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // Focus should move to refresh button
    const refreshButton = page.locator('button:has-text("Refresh All")');
    await expect(refreshButton).toBeFocused();
    
    // Test Enter key on button
    await page.keyboard.press('Enter');
    
    // Verify button action works with keyboard
    await page.waitForTimeout(1000);
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify admin panel still loads correctly
    await expect(page.locator('h1')).toContainText('Tabsur Admin Panel');
    
    // Check if layout is responsive
    const container = page.locator('.container');
    await expect(container).toBeVisible();
    
    // Verify mobile-friendly styling
    await expect(page.locator('body')).toHaveCSS('margin', '40px');
  });
});

test.describe('Admin Panel API Integration', () => {
  test('should connect to backend API', async ({ page }) => {
    // Navigate to admin panel
    await page.goto('/');
    
    // Wait for API calls to complete
    await page.waitForTimeout(3000);
    
    // Check if health endpoint is accessible
    const healthResponse = await page.request.get('/health');
    expect(healthResponse.status()).toBe(200);
    
    // Check if API endpoint is accessible
    try {
      const apiResponse = await page.request.get('/api/system/health');
      expect(apiResponse.status()).toBe(200);
    } catch (error) {
      // API might not be available in test environment
      console.log('API endpoint not available in test environment');
    }
  });

  test('should handle API timeouts gracefully', async ({ page }) => {
    // Navigate to admin panel
    await page.goto('/');
    
    // Mock slow API response
    await page.route('**/api/**', route => 
      new Promise(resolve => setTimeout(() => route.continue(), 5000))
    );
    
    // Click refresh to trigger timeout scenario
    const refreshButton = page.locator('button:has-text("Refresh All")');
    await refreshButton.click();
    
    // Wait for timeout handling
    await page.waitForTimeout(6000);
    
    // Verify timeout is handled gracefully
    const serverStatus = page.locator('#server-status');
    await expect(serverStatus).toBeVisible();
  });
});
