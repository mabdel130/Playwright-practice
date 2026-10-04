import { Locator } from '@playwright/test';
import * as path from 'path';
import { BasePage } from '../../../core/BasePage';
import { loadEnvConfig } from '../../../core/config/EnvConfig';
import { Navigable } from '../../../core/contracts';

export const ALERTS_SUITE_DIR = path.resolve(__dirname, '..');
const { baseUrl } = loadEnvConfig(ALERTS_SUITE_DIR);

export class AlertsPage extends BasePage implements Navigable {
  async goto(): Promise<void> {
    await this.navigate(baseUrl);
  }

  private selectSimpleAlertButton(): Locator {
    return this.page.getByRole('button', { name: /^Simple Alert$/i });
  }

  private selectConfirmAlertButton(): Locator {
    return this.page.getByRole('button', { name: /^Confirmation Alert$/i });
  }

  private selectPromptAlertButton(): Locator {
    return this.page.getByRole('button', { name: /^Prompt Alert$/i });
  }

  private async handleDialog(
    buttonLocator: Locator,
    backupLocators: Locator[],
    action: 'accept' | 'dismiss' = 'accept',
    inputText?: string,
  ): Promise<string> {
    const dialogPromise = this.page.waitForEvent('dialog');
    const clickPromise = this.healingLocator.clickWithHealing(buttonLocator, backupLocators);
    const dialog = await dialogPromise;
    const message = dialog.message();
    this.logger.step(`Dialog "${message}" -> ${action}`);

    if (action === 'accept') {
      await dialog.accept(inputText);
    } else {
      await dialog.dismiss();
    }
    await clickPromise;
    return message;
  }

  async handleSimpleAlert(): Promise<string> {
    return this.handleDialog(this.selectSimpleAlertButton(), [
      this.page.locator('#alertBtn'),
      this.page.locator('button[onclick="myFunctionAlert()"]'),
    ]);
  }

  async handleConfirmAlertAccept(): Promise<string> {
    return this.handleDialog(this.selectConfirmAlertButton(), [
      this.page.locator('#confirmBtn'),
      this.page.locator('button[onclick="myFunctionConfirm()"]'),
    ], 'accept');
  }

  async handlePromptAlertWithInput(inputText: string): Promise<string> {
    return this.handleDialog(this.selectPromptAlertButton(), [
      this.page.locator('#promptBtn'),
      this.page.locator('button[onclick="myFunctionPrompt()"]'),
    ], 'accept', inputText);
  }
}
