import { test, expect } from '../fixtures';
import { loadData } from '../../../core/data/DataLoader';
import { ENV } from '../../../core/env';
import { SUITE_DIR } from '../config/ClientConfig';
import { LoginCase, UsersData, resolveCredentials } from '../data/TestData';

const users = loadData<UsersData>(SUITE_DIR, 'users.data.json');
const loginCases = loadData<LoginCase[]>(SUITE_DIR, 'login.data.json');

test.describe(`RahulShettyClient - Login API [${ENV}]`, () => {
  for (const testCase of loginCases) {
    test(`${testCase.id}: ${testCase.title}`, async ({ authApi }) => {
      const { email, password } = resolveCredentials(users, testCase);

      const response = await test.step(`${testCase.id}: POST /auth/login (${testCase.technique})`, async () => {
        return authApi.login(email, password);
      });

      await test.step(`${testCase.id}: Verify expected response`, async () => {
        expect(response.status()).toBe(testCase.expected.status);
        const body = await response.json();
        expect(body.message).toContain(testCase.expected.message);

        if (testCase.expected.type === 'success') {
          expect(typeof body.token).toBe('string');
          expect(body.token.length).toBeGreaterThan(0);
          expect(body.userId).toBeTruthy();
        } else {
          expect(body.token).toBeUndefined();
        }
      });
    });
  }
});
