import { test as base, expect } from '../../core/fixtures';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AddToCartPage } from './pages/AddToCartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AuthApi } from './api/AuthApi';

type ClientFixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  addToCartPage: AddToCartPage;
  checkoutPage: CheckoutPage;
  authApi: AuthApi;
};

export const test = base.extend<ClientFixtures>({
  loginPage: async ({ page, logger }, use) => use(new LoginPage(page, logger)),
  registerPage: async ({ page, logger }, use) => use(new RegisterPage(page, logger)),
  addToCartPage: async ({ page, logger }, use) => use(new AddToCartPage(page, logger)),
  checkoutPage: async ({ page, logger }, use) => use(new CheckoutPage(page, logger)),
  authApi: async ({ request, logger }, use) => use(new AuthApi(request, logger)),
});

export { expect };
