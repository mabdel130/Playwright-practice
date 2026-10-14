import { Locator, expect } from '@playwright/test';
import { ClientBasePage } from './ClientBasePage';
import { Navigable } from '../../../core/contracts';

export class AddToCartPage extends ClientBasePage implements Navigable {
  async goto(): Promise<void> {
    await this.gotoRoute('/dashboard/dash');
  }

  private selectCartNavButton(): Locator {
    return this.page.locator('[routerlink="/dashboard/cart"]');
  }

  private selectCartCountLabel(): Locator {
    return this.selectCartNavButton().locator('label');
  }

  private selectProductCard(productName: string): Locator {
    return this.page.locator('.card', { hasText: productName });
  }

  private selectAddToCartButton(productName: string): Locator {
    return this.selectProductCard(productName).getByRole('button', { name: 'Add To Cart' });
  }

  private selectViewProductButton(productName: string): Locator {
    return this.selectProductCard(productName).getByRole('button', { name: 'View' });
  }

  private selectCheckoutButton(): Locator {
    return this.page.getByRole('button', { name: 'Checkout' });
  }

  private selectCartItemRow(productName: string): Locator {
    return this.page.getByText(productName, { exact: true }).first();
  }

  private selectSearchBox(): Locator {
    return this.page.getByRole('textbox', { name: 'search' }).first();
  }

  private selectNoProductsMessage(): Locator {
    return this.page.getByText(/showing 0 results/i);
  }

  getCartItemRowLocator(productName: string): Locator {
    return this.selectCartItemRow(productName);
  }

  getProductCardLocator(productName: string): Locator {
    return this.selectProductCard(productName);
  }

  async expectCartCount(count: number): Promise<void> {
    await expect(this.selectCartCountLabel()).toHaveText(String(count));
  }

  private async readCartCount(): Promise<number> {
    const parsed = parseInt(((await this.selectCartCountLabel().textContent()) ?? '').trim(), 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  async addProductToCart(productName: string): Promise<void> {
    this.logger.step(`Adding product to cart: ${productName}`);
    await this.selectAddToCartButton(productName).click();
  }

  async addProductAndVerifyCartIncreasedByOne(productName: string): Promise<void> {
    await expect(this.selectProductCard(productName)).toBeVisible();
    const before = await this.readCartCount();
    await this.addProductToCart(productName);
    await this.expectCartCount(before + 1);
  }

  async openProductDetailsAndGetId(productName: string): Promise<string> {
    this.logger.step(`Opening product details: ${productName}`);
    await this.clickWhenVisible(this.selectViewProductButton(productName));
    await this.page.waitForURL(/\/product-details\/\w+$/);
    const productId = this.page.url().split('/product-details/')[1];
    this.logger.info(`Product "${productName}" ID: ${productId}`);
    return productId;
  }

  async goToCart(): Promise<void> {
    this.logger.step('Going to cart');
    await this.clickWhenVisible(this.selectCartNavButton());
  }

  async proceedToCheckout(): Promise<void> {
    this.logger.step('Proceeding to checkout');
    await this.clickWhenVisible(this.selectCheckoutButton());
  }

  async searchProduct(productName: string): Promise<void> {
    this.logger.step(`Searching for product: ${productName}`);
    const searchBox = this.selectSearchBox();
    await searchBox.fill(productName);
    await searchBox.press('Enter');
  }

  async verifyNoProductsFound(): Promise<void> {
    this.logger.step('Verifying no products found message');
    await expect(this.selectNoProductsMessage()).toBeVisible();
  }
}
