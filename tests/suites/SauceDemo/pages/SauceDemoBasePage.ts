import { Page } from '@playwright/test';
import { BasePage } from '../../../core/BasePage';
import { Logger } from '../../../core/Logger';

export class SauceDemoBasePage extends BasePage {
  static readonly BASE_URL = 'https://www.saucedemo.com/';

  constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  async open(): Promise<void> {
    this.logger.step('Opening SauceDemo application');
    await this.goto(SauceDemoBasePage.BASE_URL);
  }
}
