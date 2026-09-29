import { test, expect } from '../../../core/fixtures';
import * as fs from 'fs';
import * as path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { AddToCartPage } from '../pages/AddToCartPage';
import { ENV } from '../../../core/env';

const cartDataPath = path.resolve(__dirname, '../data', ENV, 'cart.data.json');
const cartData = JSON.parse(fs.readFileSync(cartDataPath, 'utf-8'));

test.describe(`RahulShettyClient - Add to Cart [${ENV}]`, () => {
  let loginPage: LoginPage;
  let addToCartPage: AddToCartPage;

  test.beforeEach(async ({ page, logger }) => {
    loginPage = new LoginPage(page, logger);
    addToCartPage = new AddToCartPage(page, logger);

    await loginPage.goto();
    await loginPage.login(cartData.user.email, cartData.user.password);
    await expect(page).toHaveURL(/dashboard/);
    await addToCartPage.goto();
  });

  test('TC05: add valid product to cart (positive)', async ({ logger, autoScreenshot }) => {
    await test.step('TC05: Verify product is available', async () => {
      const productCard = addToCartPage.getProductCardLocator(cartData.validProduct);
      await expect(productCard).toBeVisible();
    });

    await test.step('TC05: Add valid product to cart and verify count increased', async () => {
      await addToCartPage.addProductAndVerifyCartIncreasedByOne(cartData.validProduct);
    });

    await test.step('TC05: Navigate to cart and verify product is there', async () => {
      await addToCartPage.goToCart();
      const cartItem = addToCartPage.getCartItemRowLocator(cartData.validProduct);
      await expect(cartItem).toBeVisible();
    });
  });

  test('TC06: verify invalid product is not available in cart (negative)', async ({ logger }) => {
    await test.step('TC06: Search for invalid product using search box', async () => {
      logger.info(`Searching for invalid product: ${cartData.invalidProduct}`);
      await addToCartPage.searchProduct(cartData.invalidProduct);
    });

    await test.step('TC06: Verify no products found message appears', async () => {
      await addToCartPage.verifyNoProductsFound();
      logger.info('Confirmed: No products found message displayed');
    });

    await test.step('TC06: Verify cart remains empty (no products added)', async () => {
      const cartCount = await addToCartPage.getCartCount();
      expect(cartCount).toBe(0);
      logger.info(`Cart count: ${cartCount} (empty as expected)`);
    });
  });
});
