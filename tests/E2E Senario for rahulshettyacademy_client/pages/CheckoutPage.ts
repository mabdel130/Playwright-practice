import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { CheckoutData } from '../utils/TestData';

export class CheckoutPage extends BasePage {
  private readonly creditCardRow: Locator;
  private readonly expiryAndCvvRow: Locator;
  private readonly nameOnCardRow: Locator;

  readonly cardNumberInput: Locator;
  readonly expiryMonthSelect: Locator;
  readonly expirySecondSelect: Locator;
  readonly cvvInput: Locator;
  readonly nameOnCardInput: Locator;
  readonly couponInput: Locator;
  readonly applyCouponButton: Locator;

  readonly shippingNameInput: Locator;
  readonly countryInput: Locator;
  readonly countrySuggestions: Locator;
  readonly placeOrderButton: Locator;
  readonly orderConfirmationMessage: Locator;

  constructor(page: Page) {
    super(page);

    const ccForm = page.locator('.form__cc');
    this.creditCardRow = ccForm.locator('.row').nth(0);
    this.expiryAndCvvRow = ccForm.locator('.row').nth(1);
    this.nameOnCardRow = ccForm.locator('.row').nth(2);

    this.cardNumberInput = this.creditCardRow.locator('input');
    this.expiryMonthSelect = this.expiryAndCvvRow.locator('select').nth(0);
    this.expirySecondSelect = this.expiryAndCvvRow.locator('select').nth(1);
    this.cvvInput = this.expiryAndCvvRow.locator('input.txt');
    this.nameOnCardInput = this.nameOnCardRow.locator('input');
    this.couponInput = page.locator('input[name="coupon"]');
    this.applyCouponButton = page.getByRole('button', { name: 'Apply Coupon' });

    this.shippingNameInput = page.locator('.user__name input[type="text"]');
    this.countryInput = page.locator('input[placeholder="Select Country"]');
    this.countrySuggestions = page.locator('.ta-results .ta-item');
    this.placeOrderButton = page.locator('a.action__submit');
    this.orderConfirmationMessage = page.getByText('THANKYOU FOR THE ORDER.', { exact: false });
  }

  async fillPaymentDetails(data: CheckoutData): Promise<void> {
    await this.fillField(this.cardNumberInput, data.cardNumber);
    await this.selectOption(this.expiryMonthSelect, data.expiryMonth);
    await this.selectOption(this.expirySecondSelect, data.expiryDay);
    await this.fillField(this.cvvInput, data.cvv);
    await this.fillField(this.nameOnCardInput, data.nameOnCard);
  }

  async fillShippingName(fullName: string): Promise<void> {
    await this.fillField(this.shippingNameInput, fullName);
  }

  async selectCountry(countryName: string): Promise<void> {
    await this.countryInput.click();
    await this.countryInput.pressSequentially(countryName, { delay: 80 });

    const suggestion = this.countrySuggestions.getByText(countryName, { exact: true }).first();
    await suggestion.waitFor({ state: 'visible' });
    await suggestion.click();
  }

  async clickPlaceOrder(): Promise<void> {
    await this.clickWhenVisible(this.placeOrderButton);
  }
}
