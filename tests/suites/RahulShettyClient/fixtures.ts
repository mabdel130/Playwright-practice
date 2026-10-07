import { test as base, expect } from '../../core/fixtures';
import { faker } from '../../core/TestDataFactory';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AddToCartPage } from './pages/AddToCartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { AuthApi } from './api/AuthApi';
import { CheckoutFlow } from './flows/CheckoutFlow';
import { UserData } from './data/TestData';

// A unique user per test so every test has its own empty cart and order history.
function buildIsolatedUser(): UserData {
  const id = `${Date.now()}${faker.string.alphanumeric(6).toLowerCase()}`;
  return {
    firstName: 'Isolated',
    lastName: 'User',
    email: `isolated.${id}@gmail.com`,
    phone: '9876543210',
    occupation: 'Engineer',
    gender: 'Male',
    password: `Iso@${id}`,
  };
}

type ClientFixtures = {
  /** Precondition: registers a fresh isolated user via API, logs in with its token and lands on the dashboard. */
  loginAsValidUser: () => Promise<UserData>;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  addToCartPage: AddToCartPage;
  checkoutPage: CheckoutPage;
  ordersPage: OrdersPage;
  authApi: AuthApi;
  checkoutFlow: CheckoutFlow;
};

export const test = base.extend<ClientFixtures>({
  loginPage: async ({ page, logger }, use) => use(new LoginPage(page, logger)),
  registerPage: async ({ page, logger }, use) => use(new RegisterPage(page, logger)),
  addToCartPage: async ({ page, logger }, use) => use(new AddToCartPage(page, logger)),
  checkoutPage: async ({ page, logger }, use) => use(new CheckoutPage(page, logger)),
  ordersPage: async ({ page, logger }, use) => use(new OrdersPage(page, logger)),
  authApi: async ({ request, logger }, use) => use(new AuthApi(request, logger)),
  checkoutFlow: async ({ addToCartPage, checkoutPage }, use) => use(new CheckoutFlow(addToCartPage, checkoutPage)),
  loginAsValidUser: async ({ page, authApi, loginPage, addToCartPage }, use) => {
    await use(() =>
      base.step('Precondition: register isolated user and log in via API', async () => {
        const user = buildIsolatedUser();
        await authApi.register(user);
        await loginPage.loginWithToken(await authApi.getToken(user.email, user.password));
        await addToCartPage.goto();
        await expect(page).toHaveURL(/dashboard/);
        return user;
      }),
    );
  },
});

export { expect };
