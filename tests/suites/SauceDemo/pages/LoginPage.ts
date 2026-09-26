import { Page } from '@playwright/test';
import { SauceDemoBasePage } from './SauceDemoBasePage';
import { Logger } from '../../../core/Logger';

export class LoginPage extends SauceDemoBasePage {
  constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  public async login(username: string, password: string): Promise<void> {
    this.logger.step(`Logging in with username: ${username}`);
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
