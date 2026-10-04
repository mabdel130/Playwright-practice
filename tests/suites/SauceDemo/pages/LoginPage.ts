import { Locator } from '@playwright/test';
import { SauceDemoBasePage } from './SauceDemoBasePage';
import { Navigable } from '../../../core/contracts';

export class LoginPage extends SauceDemoBasePage implements Navigable {
  private selectUsernameInput(): Locator {
    return this.page.getByPlaceholder('Username');
  }

  private selectPasswordInput(): Locator {
    return this.page.getByPlaceholder('Password');
  }

  private selectLoginButton(): Locator {
    return this.page.getByRole('button', { name: 'Login' });
  }

  async goto(): Promise<void> {
    await this.navigate(this.baseUrl);
  }

  async login(username: string, password: string): Promise<void> {
    this.logger.step(`Logging in with username: ${username}`);
    await this.fillField(this.selectUsernameInput(), username);
    await this.fillField(this.selectPasswordInput(), password);
    await this.clickWhenVisible(this.selectLoginButton());
  }
}
