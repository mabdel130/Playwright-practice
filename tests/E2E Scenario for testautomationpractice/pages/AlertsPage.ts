import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SelfHealingLocator } from '../utils/SelfHealingLocator';

export class AlertsPage extends BasePage {
  private healingLocator: SelfHealingLocator;

  constructor(page: Page) {
    super(page);
    this.healingLocator = new SelfHealingLocator(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('https://testautomationpractice.blogspot.com/');
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
    inputText?: string
  ): Promise<string> {
    let dialogMessage = '';

    this.page.once('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await this.page.waitForTimeout(500);

      if (action === 'accept') {
        if (inputText !== undefined) {
          await dialog.accept(inputText);
        } else {
          await dialog.accept();
        }
      } else {
        await dialog.dismiss();
      }
    });

    await this.healingLocator.clickWithHealing(buttonLocator, backupLocators);
    await this.page.waitForTimeout(500);

    return dialogMessage;
  }

  async handleSimpleAlert(): Promise<string> {
    const primary = this.selectSimpleAlertButton();
    const backups = [
      this.page.locator('#alertBtn'),
      this.page.locator('button[onclick="myFunctionAlert()"]'),
    ];
    return await this.handleDialog(primary, backups);
  }

  async handleConfirmAlertAccept(): Promise<string> {
    const primary = this.selectConfirmAlertButton();
    const backups = [
      this.page.locator('#confirmBtn'),
      this.page.locator('button[onclick="myFunctionConfirm()"]'),
    ];
    return await this.handleDialog(primary, backups, 'accept');
  }

  async handlePromptAlertWithInput(inputText: string): Promise<string> {
    const primary = this.selectPromptAlertButton();
    const backups = [
      this.page.locator('#promptBtn'),
      this.page.locator('button[onclick="myFunctionPrompt()"]'),
    ];
    return await this.handleDialog(primary, backups, 'accept', inputText);
  }
}
