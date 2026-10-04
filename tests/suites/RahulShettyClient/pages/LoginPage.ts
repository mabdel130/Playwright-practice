import { Page, Locator } from '@playwright/test';
import { ClientBasePage } from './ClientBasePage';
import { ILogger } from '../../../core/Logger';
import { Navigable } from '../../../core/contracts';

export class LoginPage extends ClientBasePage implements Navigable {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page, logger: ILogger) {
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

  async loginWithToken(token: string): Promise<void> {
    this.logger.step('Injecting API token into localStorage');
    const setToken = (t: string) =>
      (globalThis as unknown as { localStorage: { setItem(k: string, v: string): void } }).localStorage.setItem('token', t);
    await this.page.addInitScript(setToken, token);
    // The app reads the token only at bootstrap, so an already-loaded app must reload.
    if (this.page.url().startsWith('http')) {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
    }
  }
}
