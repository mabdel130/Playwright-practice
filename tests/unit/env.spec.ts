import { test, expect } from '@playwright/test';
import { parseEnv } from '../core/env';

test.describe('parseEnv', () => {
  test('defaults to "test" when unset', () => {
    expect(parseEnv(undefined)).toBe('test');
  });

  for (const env of ['dev', 'test', 'staging', 'prod']) {
    test(`accepts "${env}"`, () => {
      expect(parseEnv(env)).toBe(env);
    });
  }

  test('rejects unknown values', () => {
    expect(() => parseEnv('qa')).toThrow(/Invalid TEST_ENV/);
  });
});
