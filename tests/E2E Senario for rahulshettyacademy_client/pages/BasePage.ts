import { Page, Locator, expect } from '@playwright/test';
import path from 'path';
import { SelfHealingLocator } from '../utils/SelfHealingLocator';

export class BasePage {
  readonly page: Page;
  protected readonly clientBaseUrl = 'https://rahulshettyacademy.com/client/#';
  private readonly screenshotsDir = path.join(__dirname, '..', 'screenshots');
  protected healingLocator: SelfHealingLocator;

  constructor(page: Page) {
    this.page = page;
    this.healingLocator = new SelfHealingLocator(page);
  }
  async gotoRoute(route: string): Promise<void> {
    await this.page.goto(`${this.clientBaseUrl}${route}`);
  }
  async clickWhenVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }
  async fillField(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }
  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(value);
  }

  async expectText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(text);
  }

  async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  toastMessage(text: string): Locator {
    return this.page.getByText(text, { exact: false });
  }

  async takeScreenshot(name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = path.join(this.screenshotsDir, `${timestamp}_${name}.png`);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  }

  async clickWithHealing(primary: Locator, backups: Locator[] = []): Promise<void> {
    await this.healingLocator.clickWithHealing(primary, backups);
  }

  async fillWithHealing(value: string, primary: Locator, backups: Locator[] = []): Promise<void> {
    await this.healingLocator.fillWithHealing(value, primary, backups);
  }
}
