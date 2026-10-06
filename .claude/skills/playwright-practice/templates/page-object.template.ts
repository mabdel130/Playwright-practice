// Copy to tests/suites/<Suite>/pages/<Name>Page.ts. Not a test: no .spec suffix.
import { Page, Locator } from '@playwright/test';
import { ClientBasePage } from './ClientBasePage'; // replace with actual <Suite>BasePage
import { ILogger } from '../../../core/Logger';
import { Navigable } from '../../../core/contracts';

export class ExamplePage extends ClientBasePage implements Navigable {
  readonly submitButton: Locator;

  constructor(page: Page, logger: ILogger) {
    super(page, logger);
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async goto(): Promise<void> {
    await this.gotoRoute('/example');
  }

  async submit(email: string): Promise<void> {
    this.logger.step(`Submitting for ${email}`);
    await this.fillField(page.getByLabel('Email'), email);
    await this.clickWhenVisible(this.submitButton);
  }
}
