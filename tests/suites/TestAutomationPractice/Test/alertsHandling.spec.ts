import { test, expect } from '../../../core/fixtures';
import * as fs from 'fs';
import * as path from 'path';
import { AlertsPage } from '../pages/AlertsPage';
import { ENV } from '../../../core/env';

const alertsDataPath = path.resolve(__dirname, '../data', ENV, 'alerts.data.json');
const alertsData = JSON.parse(fs.readFileSync(alertsDataPath, 'utf-8'));

test.use({ launchOptions: { slowMo: 1100 } });

test.describe(`Alerts Handling [${ENV}]`, () => {
  let alertsPage: AlertsPage;

  test.beforeEach(async ({ page, logger }) => {
    alertsPage = new AlertsPage(page, logger);
    await alertsPage.goto();
    await page.waitForTimeout(1000);
  });

  test('Test 1: Handle Simple Alert', async ({ page, logger, autoScreenshot }) => {
    logger.step('Starting simple alert test');
    const alertMessage = await alertsPage.handleSimpleAlert();

    expect(alertMessage).toBeTruthy();
    expect(alertMessage.toLowerCase()).toContain('alert');
    expect(page.url()).toContain('testautomationpractice.blogspot.com');

    await page.waitForTimeout(800);
    logger.step('Simple alert test completed');
  });

  test('Test 2: Handle Confirmation Alert', async ({ page, logger, autoScreenshot }) => {
    logger.step('Starting confirmation alert test');
    const confirmMessage = await alertsPage.handleConfirmAlertAccept();

    expect(confirmMessage).toBeTruthy();
    expect(confirmMessage.toLowerCase()).toContain('button');
    expect(page.url()).toContain('testautomationpractice.blogspot.com');

    await page.waitForTimeout(800);
    logger.step('Confirmation alert test completed');
  });

  test('Test 3: Handle Prompt Alert with Input', async ({ page, logger, autoScreenshot }) => {
    logger.step('Starting prompt alert test');
    const promptMessage = await alertsPage.handlePromptAlertWithInput(alertsData.promptInputText);

    expect(promptMessage).toBeTruthy();
    expect(promptMessage.toLowerCase()).toContain('name');
    expect(page.url()).toContain('testautomationpractice.blogspot.com');

    await page.waitForTimeout(800);
    logger.step('Prompt alert test completed');
  });
});
