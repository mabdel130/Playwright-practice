import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserData } from '../data/TestData';

export class RegisterPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly occupationSelect: Locator;
  readonly genderMaleRadio: Locator;
  readonly genderFemaleRadio: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly ageConsentCheckbox: Locator;
  readonly registerButton: Locator;
  readonly successToast: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#userEmail');
    this.phoneInput = page.locator('#userMobile');
    this.occupationSelect = page.locator('select[formcontrolname="occupation"]');
    this.genderMaleRadio = page.locator('input[formcontrolname="gender"][value="Male"]');
    this.genderFemaleRadio = page.locator('input[formcontrolname="gender"][value="Female"]');
    this.passwordInput = page.locator('#userPassword');
    this.confirmPasswordInput = page.locator('#confirmPassword');
    this.ageConsentCheckbox = page.locator('input[formcontrolname="required"]');
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.successToast = this.toastMessage('Account Created Successfully');
  }

  async goto(): Promise<void> {
    await this.gotoRoute('/auth/register');
  }

  async registerUser(user: UserData): Promise<void> {
    await this.fillField(this.firstNameInput, user.firstName);
    await this.fillField(this.lastNameInput, user.lastName);
    await this.fillField(this.emailInput, user.email);
    await this.fillField(this.phoneInput, user.phone);
    await this.selectOption(this.occupationSelect, user.occupation);

    if (user.gender === 'Male') {
      await this.clickWhenVisible(this.genderMaleRadio);
    } else {
      await this.clickWhenVisible(this.genderFemaleRadio);
    }

    await this.fillField(this.passwordInput, user.password);
    await this.fillField(this.confirmPasswordInput, user.password);
    await this.clickWhenVisible(this.ageConsentCheckbox);
    await this.clickWhenVisible(this.registerButton);
  }
}
