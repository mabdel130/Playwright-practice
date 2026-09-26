import { Page, Locator } from '@playwright/test';

export class SelfHealingLocator {
  private page: Page;
  private failedSelectors: Map<string, string[]> = new Map();

  constructor(page: Page) {
    this.page = page;
  }

  async findElement(
    primaryLocator: Locator,
    backupStrategies: Locator[]
  ): Promise<Locator> {
    try {
      await primaryLocator.waitFor({ state: 'visible', timeout: 2000 });
      return primaryLocator;
    } catch {
      console.warn('Primary locator failed, trying backup strategies...');

      for (const backup of backupStrategies) {
        try {
          await backup.waitFor({ state: 'visible', timeout: 2000 });
          console.log('✅ Backup locator found element!');
          return backup;
        } catch {
          continue;
        }
      }

      throw new Error('All locator strategies failed');
    }
  }

  async clickWithHealing(
    primaryLocator: Locator,
    backupStrategies: Locator[]
  ): Promise<void> {
    const locator = await this.findElement(primaryLocator, backupStrategies);
    await locator.click();
  }

  async fillWithHealing(
    value: string,
    primaryLocator: Locator,
    backupStrategies: Locator[]
  ): Promise<void> {
    const locator = await this.findElement(primaryLocator, backupStrategies);
    await locator.fill(value);
  }
}
