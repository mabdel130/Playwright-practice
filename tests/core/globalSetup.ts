import fs from 'fs';
import path from 'path';

const DIRS_TO_WIPE = [
  'allure-results',
  'test-results',
  'playwright-report',
];

export default async function globalSetup() {
  for (const dir of DIRS_TO_WIPE) {
    const abs = path.resolve(__dirname, '..', '..', dir);
    fs.rmSync(abs, { recursive: true, force: true });
  }

  // Defensive: wipe any leftover screenshots/ folders under tests/suites/*/screenshots
  const suitesDir = path.resolve(__dirname, '..', 'suites');
  if (fs.existsSync(suitesDir)) {
    for (const entry of fs.readdirSync(suitesDir)) {
      const screenshotsPath = path.join(suitesDir, entry, 'screenshots');
      fs.rmSync(screenshotsPath, { recursive: true, force: true });
    }
  }
}
