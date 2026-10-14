import { test as base, expect } from '../../core/fixtures';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AddToCartPage } from './pages/AddToCartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { pageFixture } from '../../core/pageFixture';
import { AuthApi } from './api/AuthApi';

type ClientFixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  addToCartPage: AddToCartPage;
  checkoutPage: CheckoutPage;
  authApi: AuthApi;
};

export const test = base.extend<ClientFixtures>({
  loginPage: pageFixture(LoginPage),
  registerPage: pageFixture(RegisterPage),
  addToCartPage: pageFixture(AddToCartPage),
  checkoutPage: pageFixture(CheckoutPage),
  authApi: async ({ request, logger }, use) => use(new AuthApi(request, logger)),
});

export { expect };
