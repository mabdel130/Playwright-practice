import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { ENV } from '../core/env';
import { loadData } from '../core/data/DataLoader';
import { loadEnvConfig } from '../core/config/EnvConfig';
import { sanitizeFileName } from '../core/fileName';

function tmpSuite(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'suite-'));
}

test.describe('DataLoader', () => {
  test('loads the file for the active env and replaces {{timestamp}}', () => {
    const dir = tmpSuite();
    fs.mkdirSync(path.join(dir, 'data', ENV), { recursive: true });
    fs.writeFileSync(path.join(dir, 'data', ENV, 'x.json'), '{"email":"a{{timestamp}}@x.com"}');
    const data = loadData<{ email: string }>(dir, 'x.json');
    expect(data.email).toMatch(/^a\d+@x\.com$/);
  });

  test('throws when the data file is missing', () => {
    expect(() => loadData(tmpSuite(), 'missing.json')).toThrow();
  });
});

test.describe('loadEnvConfig', () => {
  test('returns the entry for the active env', () => {
    const dir = tmpSuite();
    fs.mkdirSync(path.join(dir, 'config'));
    fs.writeFileSync(path.join(dir, 'config', 'env.config.json'), JSON.stringify({ [ENV]: { baseUrl: 'https://x.test' } }));
    expect(loadEnvConfig(dir).baseUrl).toBe('https://x.test');
  });

  test('throws when the env entry is missing', () => {
    const dir = tmpSuite();
    fs.mkdirSync(path.join(dir, 'config'));
    fs.writeFileSync(path.join(dir, 'config', 'env.config.json'), '{}');
    expect(() => loadEnvConfig(dir)).toThrow(/No ".*" entry/);
  });
});

test.describe('sanitizeFileName', () => {
  test('strips illegal characters and collapses whitespace', () => {
    expect(sanitizeFileName('  a: "b"  <c>?  d ')).toBe('a b c d');
  });
});
