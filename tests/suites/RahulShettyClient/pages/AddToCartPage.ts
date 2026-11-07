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

  private selectCartRows(): Locator {
    return this.page.locator('.cart li.items');
  }

  private selectCartRowNames(): Locator {
    return this.selectCartRows().locator('h3');
  }

  private selectCartRow(productName: string): Locator {
    return this.selectCartRows().filter({
      has: this.page.locator('h3', { hasText: new RegExp(`^\\s*${escapeRegExp(productName)}\\s*$`) }),
    });
  }

  private selectDeleteButton(productName: string): Locator {
    return this.selectCartRow(productName).locator('button.btn-danger');
  }

  private selectEmptyCartMessage(): Locator {
    return this.page.getByText(/No Products in Your Cart/i);
  }

  getCartItemRowLocator(productName: string): Locator {
    return this.selectCartItemRow(productName);
  }

  getProductCardLocator(productName: string): Locator {
    return this.selectProductCard(productName);
  }

  getCartRowLocator(productName: string): Locator {
    return this.selectCartRow(productName);
  }

  getDeleteButtonLocator(productName: string): Locator {
    return this.selectDeleteButton(productName);
  }

  /** The badge is blank (not "0") when the cart is empty. */
  async expectCartCount(count: number): Promise<void> {
    await expect(this.selectCartCountLabel()).toHaveText(count === 0 ? /^\s*0?\s*$/ : String(count));
  }

  async addProductsToCart(productNames: string[]): Promise<void> {
    for (const productName of productNames) {
      await this.addProductAndVerifyCartIncreasedByOne(productName);
    }
  }

  /**
   * Names of the products currently in the cart, read from the page.
   * Waits for the cart (or its empty state) to render; the cart API can be slow, hence the longer timeout.
   */
  async getCartProductNames(): Promise<string[]> {
    await expect(this.selectCartRows().first().or(this.selectEmptyCartMessage())).toBeVisible({ timeout: 30_000 });
    return (await this.selectCartRowNames().allTextContents()).map((name) => name.trim());
  }

  /** Removes one product by name, whatever its position in the cart, and verifies it is gone. */
  async removeProductFromCart(productName: string): Promise<void> {
    this.logger.step(`Removing product from cart: ${productName}`);
    const rowsBefore = (await this.getCartProductNames()).length;
    await this.clickWhenVisible(this.selectDeleteButton(productName));
    await expect(this.selectCartRow(productName)).toHaveCount(0);
    await expect(this.selectCartRows()).toHaveCount(rowsBefore - 1);
    await this.expectCartCount(rowsBefore - 1);
  }

  /** Removes every product in the cart one by one, for any number of items. Returns the removed names. */
  async removeAllProductsFromCart(): Promise<string[]> {
    const removed: string[] = [];
    for (let names = await this.getCartProductNames(); names.length > 0; names = await this.getCartProductNames()) {
      await this.removeProductFromCart(names[0]);
      removed.push(names[0]);
    }
    return removed;
  }

  async expectCartEmpty(): Promise<void> {
    this.logger.step('Verifying cart is empty');
    await expect(this.selectEmptyCartMessage()).toBeVisible();
    await expect(this.selectCartRows()).toHaveCount(0);
    await this.expectCartCount(0);
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

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
