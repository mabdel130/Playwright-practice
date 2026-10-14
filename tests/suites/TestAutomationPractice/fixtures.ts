import { test as base, expect } from '../../core/fixtures';
import { pageFixture } from '../../core/pageFixture';
import { AlertsPage } from './pages/AlertsPage';

export const test = base.extend<{ alertsPage: AlertsPage }>({
  alertsPage: pageFixture(AlertsPage),
});

export { expect };
