import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./tests/core/globalSetup.ts'),
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? '50%' : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
    ['allure-playwright', {
      resultsDir: 'allure-results',
      detail: true,
      suiteTitle: true,
    }],
  ],
  timeout: 60000,
  expect: { timeout: 10_000 },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // DEBUG_API=1 keeps a trace for every test: its Network tab shows each request/response (incl. API login) with screenshots.
    trace: process.env.DEBUG_API === '1' ? 'on' : 'retain-on-failure',
    /* Built-in screenshot for every test: shown at the top level of the HTML and Allure reports */
    screenshot: { mode: 'on', fullPage: true },
    navigationTimeout: 60000,
    actionTimeout: 60000,
    /* Slow each action down to watch a headed run, e.g. SLOWMO=800 */
    launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      // Browser-less tests of the framework code itself (ISTQB TAE ch.7).
      name: 'unit',
      testMatch: /tests[\\/]unit[\\/].*\.spec\.ts/,
    },

    {
      name: 'chromium',
      testIgnore: /tests[\\/]unit[\\/]/,
      use: {
        ...devices['Desktop Chrome'],
        // DEVTOOLS=1 opens Chrome DevTools (Network tab) on every tab so browser traffic is recorded from the start.
        launchOptions: { args: process.env.DEVTOOLS === '1' ? ['--auto-open-devtools-for-tabs'] : [] },
      },
    },

    {
      name: 'firefox',
      testIgnore: /tests[\\/]unit[\\/]/,
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      testIgnore: /tests[\\/]unit[\\/]/,
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
