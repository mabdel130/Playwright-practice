import { Page, Locator } from '@playwright/test';
import { ClientBasePage } from './ClientBasePage';
import { Logger } from '../../../core/Logger';

export class LoginPage extends ClientBasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page, logger: Logger) {
    super(page, logger);
    this.emailInput = page.locator('#userEmail');
    this.passwordInput = page.locator('#userPassword');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto(): Promise<void> {
    await this.gotoRoute('/auth/login');
  }

  async login(email: string, password: string): Promise<void> {
    this.logger.step(`Logging in with email: ${email}`);
    await this.fillField(this.emailInput, email);
    await this.fillField(this.passwordInput, password);
    await this.clickWhenVisible(this.loginButton);
  }
}
