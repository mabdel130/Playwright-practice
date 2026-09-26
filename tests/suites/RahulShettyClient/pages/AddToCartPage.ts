import { Page, Locator, expect } from '@playwright/test';
import { ClientBasePage } from './ClientBasePage';
import { Logger } from '../../../core/Logger';

export class AddToCartPage extends ClientBasePage {
  constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  async goto(): Promise<void> {
    await this.gotoRoute('/dashboard/dash');
  }

  private selectCartNavButton(): Locator {
    return this.page.locator('[routerlink="/dashboard/cart"]');
  }

  private selectCartCountLabel(): Locator {
    return this.selectCartNavButton().locator('label11');
  }

  private selectProductCard(productName: string): Locator {
    return this.page.locator('.card', { hasText: productName });
  }

  private selectAddToCartButton(productName: string): Locator {
    return this.selectProductCard(productName).getByRole('button', { name: 'Add To Cart' });
  }

  private selectCheckoutButton(): Locator {
    return this.page.getByRole('button', { name: 'Checkout' });
  }

  private selectCartItemRow(productName: string): Locator {
    return this.page.getByText(productName, { exact: true }).first();
  }

  getCartItemRowLocator(productName: string): Locator {
    return this.selectCartItemRow(productName);
  }

  async getCartCount(): Promise<number> {
    const text = (await this.selectCartCountLabel().textContent()) ?? '';
    const parsed = parseInt(text.trim(), 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  async addProductToCart(productName: string): Promise<void> {
    this.logger.step(`Adding product to cart: ${productName}`);
    const card = this.selectProductCard(productName);
    await card.waitFor({ state: 'visible' });
    await this.selectAddToCartButton(productName).click();
  }

  async addProductAndVerifyCartIncreasedByOne(productName: string): Promise<void> {
    const before = await this.getCartCount();
    await this.addProductToCart(productName);
    await expect(this.selectCartCountLabel()).toHaveText(String(before + 1));
  }

  async goToCart(): Promise<void> {
    this.logger.step('Going to cart');
    await this.clickWhenVisible(this.selectCartNavButton());
  }

  async proceedToCheckout(): Promise<void> {
    this.logger.step('Proceeding to checkout');
    await this.clickWhenVisible(this.selectCheckoutButton());
  }
}
