// Screenshots of the Playwright HTML report, filtered to @valid and @invalid tests.
// Usage: run the tests first, then `npm run report:screenshots`.
// Output: report/report-screenshots/{valid,invalid}-list.png and {valid,invalid}-first-test.png
const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');
const { chromium } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT, 'report', 'html');
const OUT_DIR = path.join(ROOT, 'report', 'report-screenshots');
const TAGS = ['valid', 'invalid'];
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json', '.zip': 'application/zip', '.txt': 'text/plain' };

if (!fs.existsSync(path.join(REPORT_DIR, 'index.html'))) {
  console.error(`report-screenshots: ${REPORT_DIR}${path.sep}index.html not found - run the tests first`);
  process.exit(1);
}

// Minimal static server for report/html (the report must be served over http to load its attachments).
function serve() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = path.join(REPORT_DIR, urlPath === '/' ? 'index.html' : urlPath);
    if (!file.startsWith(REPORT_DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const server = await serve();
  const baseUrl = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    for (const tag of TAGS) {
      // The report's search box treats "@tag" as an exact tag filter, so @valid does not match @invalid.
      await page.goto(`${baseUrl}#?q=${encodeURIComponent(`@${tag}`)}`);
      const testLinks = page.locator('a[href*="testId="]');
      const found = await testLinks.first().waitFor({ timeout: 15_000 }).then(() => true, () => false);
      const listFile = path.join(OUT_DIR, `${tag}-list.png`);
      await page.screenshot({ path: listFile, fullPage: true });
      console.log(`📸 ${path.relative(ROOT, listFile)}${found ? '' : ' (no tests with this tag)'}`);

      if (!found) continue;
      await testLinks.first().click();
      await page.waitForURL(/testId=/);
      // Wait for the attached screenshot of that test to load before capturing the page.
      await page.locator('img').last().waitFor({ timeout: 15_000 }).catch(() => {});
      const detailFile = path.join(OUT_DIR, `${tag}-first-test.png`);
      await page.screenshot({ path: detailFile, fullPage: true });
      console.log(`📸 ${path.relative(ROOT, detailFile)}`);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  console.error(`report-screenshots failed: ${error}`);
  process.exit(1);
});
