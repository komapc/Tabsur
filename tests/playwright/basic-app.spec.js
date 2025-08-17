const { test, expect } = require('@playwright/test');

test.describe('🌐 Basic App E2E Tests', () => {
  test('✅ App loads successfully', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the page loads
    await expect(page).toHaveTitle(/Tabsur/);
    
    // Check if basic content is visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('✅ Login page is accessible', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if login form elements are present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('✅ Register page is accessible', async ({ page }) => {
    // Navigate to the register page
    await page.goto('/register');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if register form elements are present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('✅ App is responsive', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
  });
});
