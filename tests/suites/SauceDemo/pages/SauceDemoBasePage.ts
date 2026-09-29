import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { BasePage } from '../../../core/BasePage';
import { Logger } from '../../../core/Logger';
import { ENV } from '../../../core/env';

export class SauceDemoBasePage extends BasePage {
  protected baseUrl: string;

  constructor(page: Page, logger: Logger) {
    super(page, logger);
    const envConfigPath = path.resolve(__dirname, '../config', 'env.config.json');
    const envConfig = JSON.parse(fs.readFileSync(envConfigPath, 'utf-8'));
    this.baseUrl = envConfig[ENV].baseUrl;
  }

  async open(): Promise<void> {
    this.logger.step('Opening SauceDemo application');
    await this.goto(this.baseUrl);
  }
}
