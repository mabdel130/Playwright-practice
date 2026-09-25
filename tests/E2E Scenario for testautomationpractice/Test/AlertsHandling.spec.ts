import { test, expect } from '@playwright/test';
import { AlertsPage } from '../pages/AlertsPage';

test.use({ launchOptions: { slowMo: 1100 } });

test.describe('Alerts Handling for testautomationpractice.blogspot.com', () => {
  let alertsPage: AlertsPage;

  test.beforeEach(async ({ page }) => {
    alertsPage = new AlertsPage(page);
    await alertsPage.goto();
    await page.waitForTimeout(1000);
  });

  test('Test 1: Handle Simple Alert', async ({ page }) => {
    const alertMessage = await alertsPage.handleSimpleAlert();

    expect(alertMessage).toBeTruthy();
    expect(alertMessage.toLowerCase()).toContain('alert');
    expect(page.url()).toContain('testautomationpractice.blogspot.com');

    await page.waitForTimeout(800);
    await alertsPage.takeScreenshot('test-1-simple-alert');
  });

  test('Test 2: Handle Confirmation Alert', async ({ page }) => {
    const confirmMessage = await alertsPage.handleConfirmAlertAccept();

    expect(confirmMessage).toBeTruthy();
    expect(confirmMessage.toLowerCase()).toContain('button');
    expect(page.url()).toContain('testautomationpractice.blogspot.com');

    await page.waitForTimeout(800);
    await alertsPage.takeScreenshot('test-2-confirmation-alert');
  });

  test('Test 3: Handle Prompt Alert with Input', async ({ page }) => {
    const testInput = 'John Doe';
    const promptMessage = await alertsPage.handlePromptAlertWithInput(testInput);

    expect(promptMessage).toBeTruthy();
    expect(promptMessage.toLowerCase()).toContain('name');
    expect(page.url()).toContain('testautomationpractice.blogspot.com');

    await page.waitForTimeout(800);
    await alertsPage.takeScreenshot('test-3-prompt-alert');
  });
});
