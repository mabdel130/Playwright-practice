import { Locator } from '@playwright/test';
import { ClientBasePage } from './ClientBasePage';
import { CheckoutData } from '../data/TestData';

export class CheckoutPage extends ClientBasePage {
  private selectCreditCardRow(): Locator {
    return this.page.locator('.form__cc').locator('.row').nth(0);
  }

  private selectExpiryAndCvvRow(): Locator {
    return this.page.locator('.form__cc').locator('.row').nth(1);
  }

  private selectNameOnCardRow(): Locator {
    return this.page.locator('.form__cc').locator('.row').nth(2);
  }

  private selectCardNumberInput(): Locator {
    return this.selectCreditCardRow().locator('input');
  }

  private selectExpiryMonthSelect(): Locator {
    return this.selectExpiryAndCvvRow().locator('select').nth(0);
  }

  private selectExpirySecondSelect(): Locator {
    return this.selectExpiryAndCvvRow().locator('select').nth(1);
  }

  private selectCvvInput(): Locator {
    return this.selectExpiryAndCvvRow().locator('input.txt');
  }

  private selectNameOnCardInput(): Locator {
    return this.selectNameOnCardRow().locator('input');
  }

  private selectShippingNameInput(): Locator {
    return this.page.locator('.user__name input[type="text"]');
  }

  private selectCountryInputField(): Locator {
    return this.page.locator('input[placeholder="Select Country"]');
  }

  private selectCountrySuggestions(): Locator {
    return this.page.locator('.ta-results .ta-item');
  }

  private selectPlaceOrderButton(): Locator {
    return this.page.locator('a.action__submit');
  }

  private selectOrderConfirmationMessage(): Locator {
    return this.page.getByText('THANKYOU FOR THE ORDER.', { exact: false });
  }

  getCountryInputLocator(): Locator {
    return this.selectCountryInputField();
  }

  getOrderConfirmationMessageLocator(): Locator {
    return this.selectOrderConfirmationMessage();
  }

  async fillPaymentDetails(data: CheckoutData): Promise<void> {
    this.logger.step('Filling payment details');
    await this.fillField(this.selectCardNumberInput(), data.cardNumber);
    await this.selectOption(this.selectExpiryMonthSelect(), data.expiryMonth);
    await this.selectOption(this.selectExpirySecondSelect(), data.expiryDay);
    await this.fillField(this.selectCvvInput(), data.cvv);
    await this.fillField(this.selectNameOnCardInput(), data.nameOnCard);
  }

  async fillShippingName(fullName: string): Promise<void> {
    this.logger.step(`Filling shipping name: ${fullName}`);
    await this.fillField(this.selectShippingNameInput(), fullName);
  }

  async selectCountry(countryName: string): Promise<void> {
    this.logger.step(`Selecting country: ${countryName}`);
    const countryInput = this.selectCountryInputField();
    await countryInput.click();
    await countryInput.pressSequentially(countryName, { delay: 80 });

    await this.selectCountrySuggestions().getByText(countryName, { exact: true }).first().click();
  }

  async clickPlaceOrder(): Promise<void> {
    this.logger.step('Clicking place order button');
    await this.clickWhenVisible(this.selectPlaceOrderButton());
  }
}
