import { Locator } from '@playwright/test';
import { ILogger } from './Logger';

export class SelfHealingLocator {
  constructor(private readonly logger: ILogger) {}

  async findElement(primaryLocator: Locator, backupStrategies: Locator[]): Promise<Locator> {
    try {
      await primaryLocator.waitFor({ state: 'visible', timeout: 2000 });
      return primaryLocator;
    } catch {
      this.logger.info('Primary locator failed, trying backup strategies...');
      for (const backup of backupStrategies) {
        try {
          await backup.waitFor({ state: 'visible', timeout: 2000 });
          this.logger.info('Backup locator found element');
          return backup;
        } catch {
          continue;
        }
      }
      throw new Error('All locator strategies failed');
    }
  }

  async clickWithHealing(primaryLocator: Locator, backupStrategies: Locator[]): Promise<void> {
    const locator = await this.findElement(primaryLocator, backupStrategies);
    await locator.click();
  }

  async fillWithHealing(value: string, primaryLocator: Locator, backupStrategies: Locator[]): Promise<void> {
    const locator = await this.findElement(primaryLocator, backupStrategies);
    await locator.fill(value);
  }
}
