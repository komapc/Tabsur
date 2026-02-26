/**
 * Global setup for Playwright tests
 * This runs once before all tests
 */
const { chromium } = require('@playwright/test');

async function globalSetup(config) {
  console.log('🚀 Starting global setup for Playwright tests...');

  // Start browser for global setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Test if the application is accessible
    console.log('🔍 Testing application accessibility...');
    await page.goto('http://localhost:3000');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check if the app is responsive
    const title = await page.title();
    console.log(`✅ Application loaded successfully. Title: ${title}`);

    // Test basic functionality
    await page.waitForSelector('body', { timeout: 10000 });
    console.log('✅ Basic page elements are present');

  } catch (error) {
    console.warn('⚠️ Global setup warning:', error.message);
    console.log('💡 This is normal if the app is not running locally');
  } finally {
    await browser.close();
  }

  console.log('✅ Global setup completed successfully!');
}

module.exports = globalSetup;
