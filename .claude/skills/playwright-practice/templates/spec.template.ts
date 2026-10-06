// Copy to tests/suites/<Suite>/Test/<name>.spec.ts. Adjust imports.
import { test, expect } from '../fixtures';
import { loadData } from '../../../core/data/DataLoader';
import { ENV } from '../../../core/env';
import { SUITE_DIR } from '../config/ExampleConfig';

interface ExampleCase {
  id: string;
  title: string;
  email: string;
  expectedMessage: string;
}

const cases = loadData<ExampleCase[]>(SUITE_DIR, 'example.data.json');

test.describe(`Example - Form [${ENV}]`, () => {
  for (const c of cases) {
    test(`${c.id}: ${c.title}`, async ({ examplePage }) => {
      await test.step(`${c.id}: Open`, async () => {
        await examplePage.goto();
      });

      await test.step(`${c.id}: Submit`, async () => {
        await examplePage.submit(c.email);
      });

      await test.step(`${c.id}: Verify`, async () => {
        // Add assertion using page object or directly on page
      });
    });
  }
});
