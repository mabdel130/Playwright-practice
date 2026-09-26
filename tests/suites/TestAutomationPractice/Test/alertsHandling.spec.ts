import { test, expect } from '../../../core/fixtures';
import { AlertsPage } from '../pages/AlertsPage';

test.use({ launchOptions: { slowMo: 1100 } });

test.describe('Alerts Handling for testautomationpractice.blogspot.com', () => {
  let alertsPage: AlertsPage;

  test.beforeEach(async ({ page, logger }) => {
    alertsPage = new AlertsPage(page, logger);
    await alertsPage.goto();
    await page.waitForTimeout(1000);
  });

  test('Test 1: Handle Simple Alert', async ({ page, logger }) => {
    logger.step('Starting simple alert test');
    const alertMessage = await alertsPage.handleSimpleAlert();

    expect(alertMessage).toBeTruthy();
    expect(alertMessage.toLowerCase()).toContain('alert');
    expect(page.url()).toContain('testautomationpractice.blogspot.com');

    await page.waitForTimeout(800);
    logger.step('Simple alert test completed');
  });

  test('Test 2: Handle Confirmation Alert', async ({ page, logger }) => {
    logger.step('Starting confirmation alert test');
    const confirmMessage = await alertsPage.handleConfirmAlertAccept();

    expect(confirmMessage).toBeTruthy();
    expect(confirmMessage.toLowerCase()).toContain('button');
    expect(page.url()).toContain('testautomationpractice.blogspot.com');

    await page.waitForTimeout(800);
    logger.step('Confirmation alert test completed');
  });

  test('Test 3: Handle Prompt Alert with Input', async ({ page, logger }) => {
    logger.step('Starting prompt alert test');
    const testInput = 'John Doe';
    const promptMessage = await alertsPage.handlePromptAlertWithInput(testInput);

    expect(promptMessage).toBeTruthy();
    expect(promptMessage.toLowerCase()).toContain('name');
    expect(page.url()).toContain('testautomationpractice.blogspot.com');

    await page.waitForTimeout(800);
    logger.step('Prompt alert test completed');
  });
});
