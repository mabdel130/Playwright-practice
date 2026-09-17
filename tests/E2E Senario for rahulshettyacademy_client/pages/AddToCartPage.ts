import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AddToCartPage extends BasePage {
  readonly cartNavButton: Locator;
  readonly cartCountLabel: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartNavButton = page.locator('[routerlink="/dashboard/cart"]');
    this.cartCountLabel = this.cartNavButton.locator('label');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async goto(): Promise<void> {
    await this.gotoRoute('/dashboard/dash');
  }

  productCard(productName: string): Locator {
    return this.page.locator('.card', { hasText: productName });
  }
  async getCartCount(): Promise<number> {
    const text = (await this.cartCountLabel.textContent()) ?? '';
    const parsed = parseInt(text.trim(), 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  async addProductToCart(productName: string): Promise<void> {
    const card = this.productCard(productName);
    await card.waitFor({ state: 'visible' });
    await card.getByRole('button', { name: 'Add To Cart' }).click();
  }

  async addProductAndVerifyCartIncreasedByOne(productName: string): Promise<void> {
    const before = await this.getCartCount();
    await this.addProductToCart(productName);
    await expect(this.cartCountLabel).toHaveText(String(before + 1));
  }

  async goToCart(): Promise<void> {
    await this.clickWhenVisible(this.cartNavButton);
  }
  cartItemRow(productName: string): Locator {
    return this.page.getByText(productName, { exact: true }).first();
  }

  async proceedToCheckout(): Promise<void> {
    await this.clickWhenVisible(this.checkoutButton);
  }
}
