import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const unitTests = /tests[\\/]unit[\\/]/;
const slowMo = Number(process.env.SLOWMO ?? 0);
const devtools = process.env.DEVTOOLS === '1' ? ['--auto-open-devtools-for-tabs'] : [];

export default defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./tests/core/globalSetup.ts'),
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright', { resultsDir: 'allure-results', detail: true, suiteTitle: true }],
  ],
  use: {
    trace: process.env.DEBUG_API === '1' ? 'on' : 'retain-on-failure',
    screenshot: { mode: 'on', fullPage: true },
    navigationTimeout: 60_000,
    actionTimeout: 60_000,
    launchOptions: { slowMo },
  },
  projects: [
    { name: 'unit', testMatch: /tests[\\/]unit[\\/].*\.spec\.ts/ },
    {
      name: 'chromium',
      testIgnore: unitTests,
      use: { ...devices['Desktop Chrome'], launchOptions: { slowMo, args: devtools } },
    },
    { name: 'firefox', testIgnore: unitTests, use: devices['Desktop Firefox'] },
    { name: 'webkit', testIgnore: unitTests, use: devices['Desktop Safari'] },
    { name: 'Mobile Chrome', testIgnore: unitTests, use: devices['Pixel 5'] },
    { name: 'Mobile Safari', testIgnore: unitTests, use: devices['iPhone 12'] },
  ],
});
