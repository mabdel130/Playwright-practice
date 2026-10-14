import { Locator } from '@playwright/test';
import { ClientBasePage } from './ClientBasePage';
import { Navigable } from '../../../core/contracts';

export class OrdersPage extends ClientBasePage implements Navigable {
  async goto(): Promise<void> {
    await this.gotoRoute('/dashboard/myorders');
  }

  private selectOrdersNavButton(): Locator {
    return this.page.locator('button[routerlink="/dashboard/myorders"]');
  }

  private selectOrderRows(): Locator {
    return this.page.locator('tbody tr');
  }

  getOrderRowsLocator(): Locator {
    return this.selectOrderRows();
  }

  getOrderRowLocator(orderId: string): Locator {
    return this.selectOrderRows().filter({ hasText: orderId });
  }

  getOrderDetailsTextLocator(text: string): Locator {
    return this.page.getByText(text, { exact: true }).first();
  }

  async openFromNav(): Promise<void> {
    this.logger.step('Opening Orders tab');
    await this.clickWhenVisible(this.selectOrdersNavButton());
  }

  async viewOrder(orderId: string): Promise<void> {
    this.logger.step(`Viewing order details: ${orderId}`);
    await this.clickWhenVisible(this.getOrderRowLocator(orderId).getByRole('button', { name: 'View' }));
  }
}
