import { Page, Locator } from '@playwright/test';
import { SelfHealingLocator } from './SelfHealingLocator';
import { ILogger } from './Logger';

export abstract class BasePage {
  protected readonly healingLocator: SelfHealingLocator;

  constructor(protected readonly page: Page, protected readonly logger: ILogger) {
    this.healingLocator = new SelfHealingLocator(logger);
  }

  protected async navigate(url: string): Promise<void> {
    this.logger.step(`Navigating to ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  protected async fillField(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  protected async clickWhenVisible(locator: Locator): Promise<void> {
    await locator.click();
  }

  protected async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.selectOption(value);
  }
}
