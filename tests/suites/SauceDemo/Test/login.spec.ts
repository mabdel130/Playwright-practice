import { test, expect } from '../fixtures';
import { loadData } from '../../../core/data/DataLoader';
import { ENV } from '../../../core/env';
import { SAUCE_SUITE_DIR } from '../pages/SauceDemoBasePage';

interface SauceLoginData {
  credentials: { username: string; password: string }[];
}

const loginData = loadData<SauceLoginData>(SAUCE_SUITE_DIR, 'login.data.json');

test(`SauceDemo - Login [${ENV}]: verifies that the default user logged successfully with valid data and is redirected to the inventory page`, async ({ page, loginPage, inventoryPage, autoScreenshot }) => {
  const { username, password } = loginData.credentials[0];
  await loginPage.goto();
  await loginPage.login(username, password);

  await expect(page).toHaveURL(inventoryPage.url);
  await expect(inventoryPage.getAppLogo()).toHaveText('Swag Labs');
});
