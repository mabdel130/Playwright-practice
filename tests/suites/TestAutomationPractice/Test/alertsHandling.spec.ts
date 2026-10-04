import { test, expect } from '../fixtures';
import { loadData } from '../../../core/data/DataLoader';
import { ENV } from '../../../core/env';
import { ALERTS_SUITE_DIR } from '../pages/AlertsPage';

const alertsData = loadData<{ promptInputText: string }>(ALERTS_SUITE_DIR, 'alerts.data.json');

test.describe(`Alerts Handling [${ENV}]`, () => {
  test.beforeEach(async ({ alertsPage }) => {
    await alertsPage.goto();
  });

  test('Test 1: Handle Simple Alert', async ({ page, alertsPage, autoScreenshot }) => {
    const alertMessage = await alertsPage.handleSimpleAlert();

    expect(alertMessage.toLowerCase()).toContain('alert');
    await expect(page).toHaveURL(/testautomationpractice\.blogspot\.com/);
  });

  test('Test 2: Handle Confirmation Alert', async ({ page, alertsPage, autoScreenshot }) => {
    const confirmMessage = await alertsPage.handleConfirmAlertAccept();

    expect(confirmMessage.toLowerCase()).toContain('button');
    await expect(page).toHaveURL(/testautomationpractice\.blogspot\.com/);
  });

  test('Test 3: Handle Prompt Alert with Input', async ({ page, alertsPage, autoScreenshot }) => {
    const promptMessage = await alertsPage.handlePromptAlertWithInput(alertsData.promptInputText);

    expect(promptMessage.toLowerCase()).toContain('name');
    await expect(page).toHaveURL(/testautomationpractice\.blogspot\.com/);
  });
});
