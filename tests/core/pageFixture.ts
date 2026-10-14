import { Page } from '@playwright/test';
import { ILogger } from './Logger';

/** Builds a fixture that injects a page object constructed with (page, logger). */
export function pageFixture<P>(PageClass: new (page: Page, logger: ILogger) => P) {
  return async ({ page, logger }: { page: Page; logger: ILogger }, use: (p: P) => Promise<void>) =>
    use(new PageClass(page, logger));
}
