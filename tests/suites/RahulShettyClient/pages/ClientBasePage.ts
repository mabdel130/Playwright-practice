import { Locator } from '@playwright/test';
import { BasePage } from '../../../core/BasePage';
import { recordLocalStorage } from '../../../core/debug';
import { clientConfig } from '../config/ClientConfig';

export abstract class ClientBasePage extends BasePage {
  async gotoRoute(route: string): Promise<void> {
    await this.navigate(`${clientConfig.baseUrl}${route}`);
    await recordLocalStorage(this.page, this.logger, route);
  }

  protected toastMessage(text: string): Locator {
    return this.page.getByText(text, { exact: false });
  }
}
