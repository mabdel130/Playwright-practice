import { test, expect } from '../fixtures';
import { loadData } from '../../../core/data/DataLoader';
import { ENV } from '../../../core/env';
import { SUITE_DIR } from '../config/ClientConfig';
import { E2EData } from '../data/TestData';

const e2eData = loadData<E2EData>(SUITE_DIR, 'e2e.data.json');

test(`E2E: complete valid flow from registration to order confirmation [${ENV}]`, async ({
  page, logger, authApi, registerPage, loginPage, addToCartPage, checkoutPage, autoScreenshot,
}) => {
  test.skip(ENV === 'prod', 'E2E creates users/orders - not run on prod');
  const user = e2eData.user;

  await test.step('E2E: Register a new user', async () => {
    await registerPage.goto();
    await registerPage.registerUser(user);
    await expect(registerPage.getSuccessToastLocator()).toBeVisible();
    logger.info(`User registered: ${user.email}`);
  });

  await test.step('E2E: Log in via API with the registered credentials', async () => {
    await loginPage.loginWithToken(await authApi.getToken(user.email, user.password));
    await addToCartPage.goto();
    await expect(page).toHaveURL(/dashboard/);
  });

  await test.step('E2E: Add product to cart', async () => {
    await expect(addToCartPage.getProductCardLocator(e2eData.product)).toBeVisible();
    await addToCartPage.addProductToCart(e2eData.product);
  });

  await test.step('E2E: Verify product is in cart', async () => {
    await addToCartPage.expectCartCount(1);
  });

  await test.step('E2E: Go to cart and proceed to checkout', async () => {
    await addToCartPage.goToCart();
    await expect(addToCartPage.getCartItemRowLocator(e2eData.product)).toBeVisible();
    await addToCartPage.proceedToCheckout();
  });

  await test.step('E2E: Fill payment details from JSON', async () => {
    await checkoutPage.fillPaymentDetails(e2eData.checkout);
  });

  await test.step('E2E: Fill shipping name', async () => {
    await checkoutPage.fillShippingName(`${user.firstName} ${user.lastName}`);
  });

  await test.step('E2E: Select country and verify', async () => {
    await checkoutPage.selectCountry(e2eData.checkout.country);
    await expect(checkoutPage.getCountryInputLocator()).toHaveValue(e2eData.checkout.country);
  });

  await test.step('E2E: Place order', async () => {
    await checkoutPage.clickPlaceOrder();
  });

  await test.step('E2E: Verify order confirmation', async () => {
    await expect(checkoutPage.getOrderConfirmationMessageLocator()).toBeVisible();
    logger.info('Order placed successfully!');
  });
});
