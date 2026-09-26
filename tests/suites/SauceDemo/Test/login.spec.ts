import { test, expect } from '../../../core/fixtures';
import { LoginPage } from '../pages/LoginPage';

test.use({ launchOptions: { slowMo: 1000 } });

test('verifies that the default user logged Successfully with valid data and is redirected to the inventory page', async ({ page, logger }) => {
  const loginPage = new LoginPage(page, logger);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('.app_logo')).toHaveText('Swag Labs');
});
