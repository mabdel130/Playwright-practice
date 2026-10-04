import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../../core/BasePage';
import { ILogger } from '../../../core/Logger';
import { Navigable } from '../../../core/contracts';

export interface PracticeFormData {
  name: string;
  email: string;
  password: string;
  gender: string;
  employmentStatus: string;
}

export class AngularPracticePage extends BasePage implements Navigable {
  constructor(page: Page, logger: ILogger, private readonly url: string) {
    super(page, logger);
  }

  async goto(): Promise<void> {
    await this.navigate(this.url);
  }

  async submitForm(data: PracticeFormData): Promise<void> {
    this.logger.step(`Filling form for ${data.name}`);
    await this.fillField(this.page.locator('form input[name="name"]'), data.name);
    await this.fillField(this.page.locator('form input[name="email"]'), data.email);
    await this.fillField(this.page.getByPlaceholder('Password'), data.password);
    await this.clickWhenVisible(this.page.getByRole('checkbox'));
    await this.selectOption(this.page.locator('select'), data.gender);
    await this.clickWhenVisible(this.page.getByLabel(data.employmentStatus));
    await this.clickWhenVisible(this.page.getByRole('button', { name: 'Submit' }));
  }

  getSuccessAlert(): Locator {
    return this.page.locator('div.alert.alert-success.alert-dismissible');
  }

  async openShop(): Promise<void> {
    this.logger.step('Opening shop');
    await this.clickWhenVisible(this.page.getByRole('link', { name: 'Shop' }));
  }

  async addProduct(productName: string): Promise<void> {
    this.logger.step(`Adding product: ${productName}`);
    await this.clickWhenVisible(
      this.page.locator('app-card').filter({ hasText: productName }).getByRole('button', { name: 'Add' }),
    );
  }

  getCheckoutButton(): Locator {
    return this.page.locator('a.nav-link.btn-primary');
  }
}
