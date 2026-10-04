import { test as base, expect } from '../../core/fixtures';
import { AlertsPage } from './pages/AlertsPage';

export const test = base.extend<{ alertsPage: AlertsPage }>({
  alertsPage: async ({ page, logger }, use) => use(new AlertsPage(page, logger)),
});

export { expect };
