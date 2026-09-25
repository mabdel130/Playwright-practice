import { Page, Locator } from '@playwright/test';
import { SelfHealingLocator } from '../utils/SelfHealingLocator';

export class BasePage {
  protected page: Page;
  protected healingLocator: SelfHealingLocator;

  constructor(page: Page) {
    this.page = page;
    this.healingLocator = new SelfHealingLocator(page);
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async fillField(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  async clickWhenVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    await locator.click();
  }

  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    await this.page.screenshot({
      path: `tests/E2E Scenario for testautomationpractice/screenshots/${timestamp}_${name}.png`,
    });
  }

  async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
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
