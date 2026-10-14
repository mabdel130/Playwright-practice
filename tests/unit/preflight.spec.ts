import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { checkSuite } from '../core/preflight';

function makeSuites(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'suites-'));
  const suite = path.join(root, 'S');
  fs.mkdirSync(path.join(suite, 'config'), { recursive: true });
  fs.writeFileSync(path.join(suite, 'config', 'env.config.json'), JSON.stringify({ test: { baseUrl: 'https://x' } }));
  for (const env of ['dev', 'test', 'staging', 'prod']) {
    fs.mkdirSync(path.join(suite, 'data', env), { recursive: true });
    fs.writeFileSync(path.join(suite, 'data', env, 'a.json'), '{"t":"{{timestamp}}"}');
  }
  return root;
}

test.describe('checkSuite', () => {
  test('reports no issues for a consistent suite', () => {
    expect(checkSuite(makeSuites(), 'S', 'test')).toEqual([]);
  });

  test('flags a missing env entry', () => {
    const issues = checkSuite(makeSuites(), 'S', 'prod');
    expect(issues.map((i) => i.message).join()).toContain('no "prod" entry');
  });

  test('flags a data file missing in one env', () => {
    const root = makeSuites();
    fs.rmSync(path.join(root, 'S', 'data', 'staging', 'a.json'));
    const issues = checkSuite(root, 'S', 'test');
    expect(issues.map((i) => i.message)).toContain('data/staging/ is missing: a.json');
  });

  test('flags invalid JSON data', () => {
    const root = makeSuites();
    fs.writeFileSync(path.join(root, 'S', 'data', 'dev', 'a.json'), '{oops');
    expect(checkSuite(root, 'S', 'test').some((i) => i.message.includes('not valid JSON'))).toBe(true);
  });
});
