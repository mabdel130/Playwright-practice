import { test as base, expect } from '../../core/fixtures';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';

type SauceDemoFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

export const test = base.extend<SauceDemoFixtures>({
  loginPage: async ({ page, logger }, use) => use(new LoginPage(page, logger)),
  inventoryPage: async ({ page, logger }, use) => use(new InventoryPage(page, logger)),
});

export { expect };
