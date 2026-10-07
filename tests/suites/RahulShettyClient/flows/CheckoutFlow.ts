import { test, expect } from '@playwright/test';
import { AddToCartPage } from '../pages/AddToCartPage';
import { CheckoutPage, CreateOrderResult } from '../pages/CheckoutPage';
import { CheckoutData } from '../data/TestData';

/** Reusable cart -> checkout -> place order steps shared by E2E and order-flow specs. */
export class CheckoutFlow {
  constructor(
    private readonly addToCartPage: AddToCartPage,
    private readonly checkoutPage: CheckoutPage,
  ) {}

  async addProductsToCart(productNames: string[]): Promise<void> {
    await test.step(`Add ${productNames.length} product(s) to cart`, async () => {
      for (const name of productNames) {
        await this.addToCartPage.addProductAndVerifyCartIncreasedByOne(name);
      }
    });
  }

  async goToCartAndProceedToCheckout(productNames: string[]): Promise<void> {
    await test.step('Go to cart, verify products and proceed to checkout', async () => {
      await this.addToCartPage.goToCart();
      for (const name of productNames) {
        await expect(this.addToCartPage.getCartItemRowLocator(name)).toBeVisible();
      }
      await this.addToCartPage.proceedToCheckout();
    });
  }

  async fillCheckoutDetails(checkout: CheckoutData, shippingName: string): Promise<void> {
    await test.step('Fill payment and shipping details', async () => {
      await this.checkoutPage.fillPaymentDetails(checkout);
      await this.checkoutPage.fillShippingName(shippingName);
      await this.checkoutPage.selectCountry(checkout.country);
      await expect(this.checkoutPage.getCountryInputLocator()).toHaveValue(checkout.country);
    });
  }

  async placeOrder(): Promise<CreateOrderResult> {
    return test.step('Place order and verify confirmation', async () => {
      const result = await this.checkoutPage.placeOrderAndCaptureResponse();
      await expect(this.checkoutPage.getOrderConfirmationMessageLocator()).toBeVisible();
      return result;
    });
  }

  /** Full path: add products -> cart -> checkout details -> place order. */
  async purchase(productNames: string[], checkout: CheckoutData, shippingName: string): Promise<CreateOrderResult> {
    await this.addProductsToCart(productNames);
    await this.goToCartAndProceedToCheckout(productNames);
    await this.fillCheckoutDetails(checkout, shippingName);
    return this.placeOrder();
  }
}
