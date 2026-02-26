// 🚀 Fast Playwright Configuration for Development
// Only tests against Chromium for maximum speed

const { defineConfig, devices } = require('@playwright/test');

const isCI = !!process.env.CI;

module.exports = defineConfig({
  testDir: './tests/playwright',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Use only 1 worker for faster startup */
  workers: 1,

  /* Reporter to use */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || (isCI ? 'http://localhost:5000' : 'http://localhost:3000'),

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',

    /* Global test timeout - reduced for speed */
    actionTimeout: 10000,
    navigationTimeout: 30000
  },

  /* Increase expect() assertion timeout (default is 5000ms) */
  expect: {
    timeout: 10000
  },

  /* Configure projects for speed - only Chromium */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  /* Run your local dev server before starting the tests.
   * In CI: serve the production React build via Express (NODE_ENV=debug).
   * Locally: use webpack dev server. */
  webServer: {
    command: isCI ? 'node server.js' : 'npm run dev',
    url: isCI ? 'http://localhost:5000' : 'http://localhost:3000',
    reuseExistingServer: !isCI,
    timeout: 120 * 1000
  },

  /* Global setup and teardown */
  globalSetup: require.resolve('./tests/playwright/global-setup.js'),
  globalTeardown: require.resolve('./tests/playwright/global-teardown.js')
});
