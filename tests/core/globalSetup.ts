import fs from 'fs';
import path from 'path';
import { ENV } from './env';
import { checkAllSuites, checkBaseUrls, PreflightIssue } from './preflight';

const DIRS_TO_WIPE = [
  'allure-results',
  'test-results',
  'playwright-report',
];

// Trend data survives the wipe: Allure's history/ and the flaky-test log written by scripts/metrics.js.
const KEEP = { 'allure-results': ['history'], 'test-results': ['flaky-history.json'] } as Record<string, string[]>;

function wipe(abs: string, keep: string[] = []): void {
  if (keep.length === 0 || !fs.existsSync(abs)) {
    fs.rmSync(abs, { recursive: true, force: true });
    return;
  }
  for (const entry of fs.readdirSync(abs)) {
    if (!keep.includes(entry)) fs.rmSync(path.join(abs, entry), { recursive: true, force: true });
  }
}

function report(issues: PreflightIssue[], strict: boolean): void {
  if (issues.length === 0) return;
  const text = issues.map((i) => `  - [${i.suite}] ${i.message}`).join('\n');
  if (strict) {
    throw new Error(`Pre-flight check failed (TEST_ENV=${ENV}):\n${text}`);
  }
  console.warn(`⚠️ Pre-flight warnings (TEST_ENV=${ENV}):\n${text}`);
}

export default async function globalSetup() {
  // Unit-only runs (npm run test:unit / verify) must not delete the screenshots and reports of the last browser run.
  if (process.env.UNIT_ONLY === '1') return;

  const root = path.resolve(__dirname, '..', '..');
  const suitesDir = path.resolve(__dirname, '..', 'suites');

  // Static setup problems (missing env entry / data files) always fail fast.
  report(checkAllSuites(suitesDir, ENV), true);
  // Network reachability only warns, unless PREFLIGHT_STRICT=1.
  report(await checkBaseUrls(suitesDir, ENV), process.env.PREFLIGHT_STRICT === '1');

  for (const dir of DIRS_TO_WIPE) {
    wipe(path.join(root, dir), KEEP[dir] ?? []);
  }

  // Defensive: wipe any leftover screenshots/ folders under tests/suites/*/screenshots
  if (fs.existsSync(suitesDir)) {
    for (const entry of fs.readdirSync(suitesDir)) {
      fs.rmSync(path.join(suitesDir, entry, 'screenshots'), { recursive: true, force: true });
    }
  }
}
