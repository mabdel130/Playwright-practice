import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../../core/BasePage';
import { Logger } from '../../../core/Logger';

export class ClientBasePage extends BasePage {
  protected readonly clientBaseUrl = 'https://rahulshettyacademy.com/client/#';

  constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  async gotoRoute(route: string): Promise<void> {
    const fullUrl = `${this.clientBaseUrl}${route}`;
    this.logger.step(`Navigating to ${fullUrl}`);
    await this.page.goto(fullUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
  }

  toastMessage(text: string): Locator {
    return this.page.getByText(text, { exact: false });
  }
}
