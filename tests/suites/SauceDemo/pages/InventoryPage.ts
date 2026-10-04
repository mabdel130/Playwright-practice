import { Locator } from '@playwright/test';
import { SauceDemoBasePage } from './SauceDemoBasePage';

export class InventoryPage extends SauceDemoBasePage {
  get url(): string {
    return `${this.baseUrl}inventory.html`;
  }

  getAppLogo(): Locator {
    return this.page.locator('.app_logo');
  }
}
