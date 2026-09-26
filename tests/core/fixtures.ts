import { test as base, expect } from '@playwright/test';
import { Logger } from './Logger';

export const test = base.extend<{ logger: Logger }>({
  logger: async ({}, use) => {
    const logger = new Logger();
    await use(logger);
  },
});

test.afterEach(async ({ page, logger }, testInfo) => {
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

export { expect };
