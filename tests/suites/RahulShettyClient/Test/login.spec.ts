import { test, expect } from '../fixtures';
import { loadData } from '../../../core/data/DataLoader';
import { ENV } from '../../../core/env';
import { SUITE_DIR } from '../config/ClientConfig';
import { LoginCase, UsersData, resolveCredentials } from '../data/TestData';

const users = loadData<UsersData>(SUITE_DIR, 'users.data.json');
const loginCases = loadData<LoginCase[]>(SUITE_DIR, 'login.data.json');

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

test.describe(`RahulShettyClient - Login API [${ENV}]`, () => {
  for (const testCase of loginCases) {
    test(`${testCase.id}: ${testCase.title}`, async ({ page, authApi }) => {
      const { email, password } = resolveCredentials(users, testCase);

      const response = await test.step(`${testCase.id}: POST /auth/login (${testCase.technique})`, async () => {
        return authApi.login(email, password);
      });
      const body = await response.json();

      await test.step(`${testCase.id}: Verify expected response`, async () => {
        expect(response.status()).toBe(testCase.expected.status);
        expect(body.message).toContain(testCase.expected.message);

        if (testCase.expected.type === 'success') {
          expect(typeof body.token).toBe('string');
          expect(body.token.length).toBeGreaterThan(0);
          expect(body.userId).toBeTruthy();
        } else {
          expect(body.token).toBeUndefined();
        }
      });

      // API-only test: render the response so the end-of-test screenshot shows real evidence.
      await test.step(`${testCase.id}: Render API response for screenshot evidence`, async () => {
        const evidence = {
          request: { email },
          status: response.status(),
          body: { ...body, ...(body.token ? { token: '***masked***' } : {}) },
        };
        await page.setContent(
          `<h2>${escapeHtml(`${testCase.id}: ${testCase.title}`)}</h2>` +
            `<pre style="font-size:16px">${escapeHtml(JSON.stringify(evidence, null, 2))}</pre>`,
        );
      });
    });
  }
});
