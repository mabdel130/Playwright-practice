import { test, expect } from '../../../core/fixtures';
import * as fs from 'fs';
import * as path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { ENV } from '../../../core/env';

const loginDataPath = path.resolve(__dirname, '../data', ENV, 'login.data.json');
const loginCases = JSON.parse(fs.readFileSync(loginDataPath, 'utf-8'));

test.describe(`RahulShettyClient - Login [${ENV}]`, () => {
  for (const testCase of loginCases) {
    test(`${testCase.id}: ${testCase.title}`, async ({ page, logger, autoScreenshot }) => {
      const loginPage = new LoginPage(page, logger);

      await test.step(`${testCase.id}: Navigate to login page`, async () => {
        await loginPage.goto();
      });

      await test.step(`${testCase.id}: Enter credentials (${testCase.technique})`, async () => {
        await loginPage.login(testCase.email, testCase.password);
      });

      await test.step(`${testCase.id}: Verify expected outcome`, async () => {
        if (testCase.expected.type === 'dashboard') {
          await expect(page).toHaveURL(/dashboard/);
        } else if (testCase.expected.type === 'toast') {
          const errorToast = page.getByText(testCase.expected.message, { exact: false });
          await expect(errorToast).toBeVisible({ timeout: 5000 });
        } else if (testCase.expected.type === 'fieldError') {
          const fieldError = page.getByText(testCase.expected.message, { exact: false });
          await expect(fieldError).toBeVisible({ timeout: 5000 });
        }
      });
    });
  }
});
