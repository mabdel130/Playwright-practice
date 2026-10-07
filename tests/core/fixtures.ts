import { test as base, expect, Page, TestInfo } from '@playwright/test';
import { Logger } from './Logger';

export const test = base.extend<{ logger: Logger; autoScreenshot: void }>({
  logger: async ({}, use) => {
    const logger = new Logger();
    await use(logger);
  },
  // auto: every test saves an end-of-test screenshot to tests/suites/<Suite>/screenshots.
  // Report attachment comes from `screenshot: 'on'` in playwright.config.ts (top level, not nested in teardown).
  autoScreenshot: [
    async ({ page }, use, testInfo) => {
      await use();
      await captureTestScreenshot(page, testInfo);
    },
    { auto: true },
  ],
});

test.afterEach(async ({ page, logger }, testInfo) => {
  // Let in-flight XHRs settle so the end-of-test screenshot isn't a "Loading..." page. Best-effort, never fails the test.
  await page.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => {});

  if (testInfo.status !== testInfo.expectedStatus) {
    const screenshotBuffer = await page.screenshot({ fullPage: true });
    await testInfo.attach('failure-screenshot', {
      body: screenshotBuffer,
      contentType: 'image/png',
    });

    const logText = logger.getText();
    if (logText) {
      await testInfo.attach('test-log', {
        body: logText,
        contentType: 'text/plain',
      });
    }
  }
});

async function captureTestScreenshot(page: Page, testInfo: TestInfo): Promise<void> {
  try {
    const testTitle = testInfo.title || 'test';
    const projectName = testInfo.project.name;
    const sanitizedTitle = sanitizeFileName(testTitle);

    const fileName = `${sanitizedTitle} [${projectName}].png`;

    const filePath = testInfo.file;
    const suiteMatch = filePath.match(/tests[\\\/]suites[\\\/]([^\\\/]+)/);
    const suiteName = suiteMatch ? suiteMatch[1] : 'general';

    const screenshotDir = require('path').join(testInfo.config.rootDir, 'suites', suiteName, 'screenshots');
    const screenshotPath = require('path').join(screenshotDir, fileName);

    if (!page.isClosed()) {
      const fs = require('fs');
      const path = require('path');
      const dir = path.dirname(screenshotPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      await page.screenshot({ path: screenshotPath, fullPage: false });

      console.log(`📸 Screenshot saved: ${screenshotPath}`);
    }
  } catch (error) {
    console.error(`⚠️ Warning: Failed to capture screenshot: ${error}`);
  }
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[<>:"|?*]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export { expect };
