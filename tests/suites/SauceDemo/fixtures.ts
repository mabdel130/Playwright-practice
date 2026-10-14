import { test as base, expect } from '../../core/fixtures';
import { pageFixture } from '../../core/pageFixture';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';

type SauceDemoFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

export const test = base.extend<SauceDemoFixtures>({
  loginPage: pageFixture(LoginPage),
  inventoryPage: pageFixture(InventoryPage),
});

export { expect };
