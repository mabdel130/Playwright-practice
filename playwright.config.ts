import { defineConfig, devices } from '@playwright/test';

const unitTests = /tests[\\/]unit[\\/]/;
const slowMo = Number(process.env.SLOWMO ?? 0);
const devtools = process.env.DEVTOOLS === '1' ? ['--auto-open-devtools-for-tabs'] : [];
const browserTestIgnore = [unitTests, /tests[\\/]Typescript_Fundamentals[\\/]/];

export const testConfig = defineConfig({
  testDir: './tests',
  globalSetup: './tests/core/globalSetup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  outputDir: 'report/test-results',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'report/html', open: 'never' }],
    ['json', { outputFile: 'report/json/results.json' }],
    ['allure-playwright', { resultsDir: 'report/allure-results', detail: true, suiteTitle: true }],
  ],
  use: {
    trace: process.env.DEBUG_API === '1' ? 'on' : 'on-first-retry',
    launchOptions: { slowMo },
    screenshot: { mode: 'on', fullPage: true },
  },
  projects: [
    {
      name: 'unit',
      testMatch: /tests[\\/]unit[\\/].*\.spec\.ts/,
    },
    {
      name: 'chromium',
      testIgnore: browserTestIgnore,
      use: { ...devices['Desktop Chrome'], launchOptions: { slowMo, args: devtools } },
    },
    {
      name: 'firefox',
      testIgnore: browserTestIgnore,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: browserTestIgnore,
      use: { ...devices['Desktop Safari'] },
    },
  ],
});

export default testConfig;
