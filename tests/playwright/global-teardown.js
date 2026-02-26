/**
 * Global teardown for Playwright tests
 * This runs once after all tests
 */
async function globalTeardown(config) {
  console.log('🧹 Starting global teardown for Playwright tests...');

  // Clean up any test artifacts or resources
  console.log('✅ Global teardown completed successfully!');
}

module.exports = globalTeardown;
