import { test, expect } from '../../../core/fixtures';
import * as fs from 'fs';
import * as path from 'path';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { AddToCartPage } from '../pages/AddToCartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ENV } from '../../../core/env';

const e2eDataPath = path.resolve(__dirname, '../data', ENV, 'e2e.data.json');
let e2eDataRaw = fs.readFileSync(e2eDataPath, 'utf-8');
e2eDataRaw = e2eDataRaw.replace(/\{\{timestamp\}\}/g, Date.now().toString());
const e2eData = JSON.parse(e2eDataRaw);

test(`E2E: complete valid flow from registration to order confirmation [${ENV}]`, async ({ page, logger, autoScreenshot }) => {
  test.skip(ENV === 'prod', 'E2E creates users/orders - not run on prod');
  const registerPage = new RegisterPage(page, logger);
  const loginPage = new LoginPage(page, logger);
  const addToCartPage = new AddToCartPage(page, logger);
  const checkoutPage = new CheckoutPage(page, logger);

  const user = e2eData.user;

  await test.step('E2E: Register a new user', async () => {
    await registerPage.goto();
    await registerPage.registerUser(user);
    await expect(registerPage.getSuccessToastLocator()).toBeVisible({ timeout: 10000 });
    logger.info(`User registered: ${user.email}`);
  });

  await test.step('E2E: Log in with the registered credentials', async () => {
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await expect(page).toHaveURL(/dashboard/);
  });

  await test.step('E2E: Navigate to products and add product to cart', async () => {
    await addToCartPage.goto();
    const productCard = addToCartPage.getProductCardLocator(e2eData.product);
    await expect(productCard).toBeVisible();
    await addToCartPage.addProductToCart(e2eData.product);
  });

  await test.step('E2E: Verify product is in cart', async () => {
    const initialCount = await addToCartPage.getCartCount();
    logger.info(`Cart count after adding product: ${initialCount}`);
  });

  await test.step('E2E: Go to cart and proceed to checkout', async () => {
    await addToCartPage.goToCart();
    const cartItem = addToCartPage.getCartItemRowLocator(e2eData.product);
    await expect(cartItem).toBeVisible();
    await addToCartPage.proceedToCheckout();
  });

  await test.step('E2E: Fill payment details from JSON', async () => {
    await checkoutPage.fillPaymentDetails(e2eData.checkout);
  });

  await test.step('E2E: Fill shipping name', async () => {
    const fullName = `${user.firstName} ${user.lastName}`;
    await checkoutPage.fillShippingName(fullName);
  });

  await test.step('E2E: Select country and verify', async () => {
    await checkoutPage.selectCountry(e2eData.checkout.country);
    await expect(checkoutPage.getCountryInputLocator()).toHaveValue(e2eData.checkout.country);
  });

  await test.step('E2E: Place order', async () => {
    await checkoutPage.clickPlaceOrder();
  });

  await test.step('E2E: Verify order confirmation', async () => {
    const confirmationMessage = checkoutPage.getOrderConfirmationMessageLocator();
    await expect(confirmationMessage).toBeVisible({ timeout: 10000 });
    logger.info('Order placed successfully!');
  });
});
