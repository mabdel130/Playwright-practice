import { test, expect } from '../fixtures';
import { loadData } from '../../../core/data/DataLoader';
import { ENV } from '../../../core/env';
import { SUITE_DIR } from '../config/ClientConfig';
import { E2EData } from '../data/TestData';

const e2eData = loadData<E2EData>(SUITE_DIR, 'e2e.data.json');

test(`E2E: complete valid flow from registration to order confirmation [${ENV}]`, async ({
  page, logger, authApi, registerPage, loginPage, addToCartPage, checkoutFlow, autoScreenshot,
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

  await test.step('E2E: Add product, checkout and place order', async () => {
    await checkoutFlow.purchase([e2eData.product], e2eData.checkout, `${user.firstName} ${user.lastName}`);
    logger.info('Order placed successfully!');
  });
});
