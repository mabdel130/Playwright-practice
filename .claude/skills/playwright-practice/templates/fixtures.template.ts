// Copy to tests/suites/<Suite>/fixtures.ts
import { test as base, expect } from '../../core/fixtures';
import { ExamplePage } from './pages/ExamplePage';
import { ExampleApi } from './api/ExampleApi';

type SuiteFixtures = {
  examplePage: ExamplePage;
  exampleApi: ExampleApi;
};

export const test = base.extend<SuiteFixtures>({
  examplePage: async ({ page, logger }, use) => use(new ExamplePage(page, logger)),
  exampleApi: async ({ request, logger }, use) => use(new ExampleApi(request, logger)),
});

export { expect };
