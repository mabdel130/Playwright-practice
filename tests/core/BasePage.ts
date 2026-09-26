import { Page, Locator, expect } from '@playwright/test';
import { SelfHealingLocator } from './SelfHealingLocator';
import { Logger } from './Logger';

export class BasePage {
  protected page: Page;
  protected healingLocator: SelfHealingLocator;
  protected logger: Logger;

  constructor(page: Page, logger: Logger) {
    this.page = page;
    this.logger = logger;
    this.healingLocator = new SelfHealingLocator(page);
  }

  async goto(url: string): Promise<void> {
    this.logger.step(`Navigating to ${url}`);
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async fillField(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  async clickWhenVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    await locator.click();
  }

  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(value);
  }

  async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  async expectText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(text);
  }

  async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async clickWithHealing(primary: Locator, backups: Locator[] = []): Promise<void> {
    await this.healingLocator.clickWithHealing(primary, backups);
  }

  async fillWithHealing(value: string, primary: Locator, backups: Locator[] = []): Promise<void> {
    await this.healingLocator.fillWithHealing(value, primary, backups);
  }

  protected waitForElement(locator: Locator, timeout: number = 5000): Promise<void> {
    return locator.waitFor({ state: 'visible', timeout });
  }
}
