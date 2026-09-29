import { Page, Locator } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { BasePage } from '../../../core/BasePage';
import { Logger } from '../../../core/Logger';
import { ENV } from '../../../core/env';

export class ClientBasePage extends BasePage {
  protected readonly clientBaseUrl: string;

  constructor(page: Page, logger: Logger) {
    super(page, logger);
    const envConfigPath = path.resolve(__dirname, '../config/env.config.json');
    const envConfig = JSON.parse(fs.readFileSync(envConfigPath, 'utf-8'));
    this.clientBaseUrl = envConfig[ENV].baseUrl;
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
