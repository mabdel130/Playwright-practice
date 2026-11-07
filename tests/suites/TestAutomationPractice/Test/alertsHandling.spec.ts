import { test, expect } from '../fixtures';
import { loadData } from '../../../core/data/DataLoader';
import { ENV } from '../../../core/env';
import { ALERTS_SUITE_DIR } from '../pages/AlertsPage';

const alertsData = loadData<{ promptInputText: string }>(ALERTS_SUITE_DIR, 'alerts.data.json');

test.describe(`Alerts Handling [${ENV}]`, () => {
  test.beforeEach(async ({ page, alertsPage }) => {
    await alertsPage.goto();
    // Google (Blogger) answers some data-center IPs, e.g. GitHub Actions runners, with a reCAPTCHA page
    // instead of the site. That is not a product defect, so skip with the reason instead of failing.
    const blockedByCaptcha = await page.getByText(/unusual traffic from your computer network/i).isVisible();
    test.skip(blockedByCaptcha, 'Site returned Google reCAPTCHA ("unusual traffic") - this runner IP is blocked');
  });

  test('TC01: Handle Simple Alert', async ({ page, alertsPage }) => {
    const alertMessage = await alertsPage.handleSimpleAlert();

    expect(alertMessage.toLowerCase()).toContain('alert');
    await expect(page).toHaveURL(/testautomationpractice\.blogspot\.com/);
  });

  test('TC02: Handle Confirmation Alert', async ({ page, alertsPage }) => {
    const confirmMessage = await alertsPage.handleConfirmAlertAccept();

    expect(confirmMessage.toLowerCase()).toContain('button');
    await expect(page).toHaveURL(/testautomationpractice\.blogspot\.com/);
  });

  test('TC03: Handle Prompt Alert with Input', async ({ page, alertsPage }) => {
    const promptMessage = await alertsPage.handlePromptAlertWithInput(alertsData.promptInputText);

    expect(promptMessage.toLowerCase()).toContain('name');
    await expect(page).toHaveURL(/testautomationpractice\.blogspot\.com/);
  });
});
