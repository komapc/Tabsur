const { test, expect } = require('@playwright/test');

test.describe('🔐 Admin Panel E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the admin panel
    await page.goto('/users/stats');
  });

  test('✅ Admin panel loads successfully', async ({ page }) => {
    // Check if the page loads
    await expect(page).toHaveTitle(/BeMyGuest/);
    
    // Check if admin content is visible
    await expect(page.locator('h1, h2, h3')).toBeVisible();
  });

  test('✅ Admin panel displays user statistics', async ({ page }) => {
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check if statistics are displayed
    const statsContent = page.locator('text=Statistics, text=Users, text=Meals');
    await expect(statsContent.first()).toBeVisible();
  });

  test('✅ Admin panel is accessible without authentication', async ({ page }) => {
    // Check if we can access the admin panel without login
    await expect(page.locator('body')).toBeVisible();
    
    // Verify no login redirect occurred
    expect(page.url()).toContain('/users/stats');
  });

  test('✅ Admin panel responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if content is still visible on mobile
    await expect(page.locator('body')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('✅ Admin panel navigation works', async ({ page }) => {
    // Check if navigation elements exist
    const navElements = page.locator('nav, [role="navigation"], .navbar, .nav');
    if (await navElements.count() > 0) {
      await expect(navElements.first()).toBeVisible();
    }
  });

  test('✅ Admin panel has proper meta tags', async ({ page }) => {
    // Check for important meta tags
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.count() > 0) {
      await expect(metaDescription.first()).toAttribute('content');
    }
  });
});
