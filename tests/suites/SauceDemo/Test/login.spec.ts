import { test, expect } from '../../../core/fixtures';
import * as fs from 'fs';
import * as path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { ENV } from '../../../core/env';

const loginDataPath = path.resolve(__dirname, '../data', ENV, 'login.data.json');
const loginData = JSON.parse(fs.readFileSync(loginDataPath, 'utf-8'));

test.use({ launchOptions: { slowMo: 1000 } });

test(`SauceDemo - Login [${ENV}]: verifies that the default user logged successfully with valid data and is redirected to the inventory page`, async ({ page, logger, autoScreenshot }) => {
  const loginPage = new LoginPage(page, logger);
  await loginPage.open();
  const credentials = loginData.credentials[0];
  await loginPage.login(credentials.username, credentials.password);

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('.app_logo')).toHaveText('Swag Labs');
});
