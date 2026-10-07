import { test, expect } from '../fixtures';
import { loadData } from '../../../core/data/DataLoader';
import { ENV } from '../../../core/env';
import { SUITE_DIR } from '../config/ClientConfig';
import { CartData } from '../data/TestData';

const cartData = loadData<CartData>(SUITE_DIR, 'cart.data.json');

test.describe(`RahulShettyClient - Add to Cart [${ENV}]`, () => {
  test.beforeEach(async ({ loginAsValidUser }) => {
    await loginAsValidUser();
  });

  test('TC05: add valid product to cart (positive)', async ({ addToCartPage, autoScreenshot }) => {
    await test.step('TC05: Verify product is available', async () => {
      await expect(addToCartPage.getProductCardLocator(cartData.validProduct)).toBeVisible();
    });

    await test.step('TC05: Add valid product to cart and verify count increased', async () => {
      await addToCartPage.addProductAndVerifyCartIncreasedByOne(cartData.validProduct);
    });

    await test.step('TC05: Navigate to cart and verify product is there', async () => {
      await addToCartPage.goToCart();
      await expect(addToCartPage.getCartItemRowLocator(cartData.validProduct)).toBeVisible();
    });
  });

  test('TC06: verify invalid product is not available in cart (negative)', async ({ addToCartPage, logger, autoScreenshot }) => {
    await test.step('TC06: Search for invalid product using search box', async () => {
      logger.info(`Searching for invalid product: ${cartData.invalidProduct}`);
      await addToCartPage.searchProduct(cartData.invalidProduct);
    });

    await test.step('TC06: Verify no products found message appears', async () => {
      await addToCartPage.verifyNoProductsFound();
    });

    await test.step('TC06: Verify invalid product is not in the cart', async () => {
      await addToCartPage.goToCart();
      await expect(addToCartPage.getCartItemRowLocator(cartData.invalidProduct)).toHaveCount(0);
    });
  });
});
