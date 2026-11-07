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
    // The app uses hash routes (#/auth/... -> #/dashboard/...). Going from one to another is not a
    // real page load, so the app may never re-read the token. Leaving the site guarantees the next
    // goto() is a full load: the init script sets the token before the app starts.
    if (this.page.url().startsWith('http')) {
      await this.page.goto('about:blank');
    }
  }
}
