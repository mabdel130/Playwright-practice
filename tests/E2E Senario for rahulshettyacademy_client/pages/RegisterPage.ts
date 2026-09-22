import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserData } from '../data/TestData';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.gotoRoute('/auth/register');
  }

  private selectFirstNameInput(): Locator {
    return this.page.locator('#firstName');
  }

  private selectLastNameInput(): Locator {
    return this.page.locator('#lastName');
  }

  private selectEmailInput(): Locator {
    return this.page.locator('#userEmail');
  }

  private selectPhoneInput(): Locator {
    return this.page.locator('#userMobile');
  }

  private selectOccupationSelect(): Locator {
    return this.page.locator('select[formcontrolname="occupation"]');
  }

  private selectGenderMaleRadio(): Locator {
    return this.page.locator('input[formcontrolname="gender"][value="Male"]');
  }

  private selectGenderFemaleRadio(): Locator {
    return this.page.locator('input[formcontrolname="gender"][value="Female"]');
  }

  private selectPasswordInput(): Locator {
    return this.page.locator('#userPassword');
  }

  private selectConfirmPasswordInput(): Locator {
    return this.page.locator('#confirmPassword');
  }

  private selectAgeConsentCheckbox(): Locator {
    return this.page.locator('input[formcontrolname="required"]');
  }

  private selectRegisterButton(): Locator {
    return this.page.getByRole('button', { name: 'Register' });
  }

  private selectSuccessToast(): Locator {
    return this.toastMessage('Account Created Successfully');
  }

  getSuccessToastLocator(): Locator {
    return this.selectSuccessToast();
  }

  async registerUser(user: UserData): Promise<void> {
    await this.fillField(this.selectFirstNameInput(), user.firstName);
    await this.fillField(this.selectLastNameInput(), user.lastName);
    await this.fillField(this.selectEmailInput(), user.email);
    await this.fillField(this.selectPhoneInput(), user.phone);
    await this.selectOption(this.selectOccupationSelect(), user.occupation);

    if (user.gender === 'Male') {
      await this.clickWhenVisible(this.selectGenderMaleRadio());
    } else {
      await this.clickWhenVisible(this.selectGenderFemaleRadio());
    }

    await this.fillField(this.selectPasswordInput(), user.password);
    await this.fillField(this.selectConfirmPasswordInput(), user.password);
    await this.clickWhenVisible(this.selectAgeConsentCheckbox());
    await this.clickWhenVisible(this.selectRegisterButton());
    await this.selectSuccessToast().waitFor({ state: 'visible', timeout: 10000 });
  }
}
