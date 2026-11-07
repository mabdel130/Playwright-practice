// Test automation metrics (ISTQB TAE ch.8). Reads test-results/results.json (Playwright JSON reporter),
// writes test-results/metrics.json + test-results/metrics.md and appends flaky tests to flaky-history.json.
const fs = require('fs');
const path = require('path');

const RESULTS_DIR = path.resolve(__dirname, '..', 'test-results');
const resultsFile = path.join(RESULTS_DIR, 'results.json');
if (!fs.existsSync(resultsFile)) {
  console.error(`metrics: ${resultsFile} not found - run the tests first`);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
const tests = [];
(function walk(suite, titles) {
  const here = suite.title ? [...titles, suite.title] : titles;
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests ?? []) {
      const results = t.results ?? [];
      tests.push({
        title: [...here, spec.title].join(' > '),
        project: t.projectName,
        status: t.status, // expected | unexpected | flaky | skipped
        duration: results.reduce((sum, r) => sum + r.duration, 0),
        retries: Math.max(0, results.length - 1),
        healed: (t.annotations ?? []).filter((a) => a.type === 'healed').length,
      });
    }
  }
  for (const child of suite.suites ?? []) walk(child, here);
})({ suites: report.suites, title: '' }, []);

const count = (s) => tests.filter((t) => t.status === s).length;
const executed = tests.length - count('skipped');
const metrics = {
  generatedAt: new Date().toISOString(),
  env: process.env.TEST_ENV || 'test',
  total: tests.length,
  passed: count('expected'),
  failed: count('unexpected'),
  flaky: count('flaky'),
  skipped: count('skipped'),
  passRate: executed ? Number(((count('expected') + count('flaky')) / executed * 100).toFixed(1)) : 0,
  totalDurationSec: Number((tests.reduce((s, t) => s + t.duration, 0) / 1000).toFixed(1)),
  healedLocators: tests.reduce((s, t) => s + t.healed, 0),
  slowest: [...tests].sort((a, b) => b.duration - a.duration).slice(0, 5)
    .map((t) => ({ title: t.title, project: t.project, seconds: Number((t.duration / 1000).toFixed(1)) })),
  flakyTests: tests.filter((t) => t.status === 'flaky').map((t) => ({ title: t.title, project: t.project })),
};

fs.writeFileSync(path.join(RESULTS_DIR, 'metrics.json'), JSON.stringify(metrics, null, 2));

// Flaky history: carried between CI runs via the uploaded artifact / cache.
const historyFile = path.join(RESULTS_DIR, 'flaky-history.json');
const history = fs.existsSync(historyFile) ? JSON.parse(fs.readFileSync(historyFile, 'utf-8')) : [];
if (metrics.flakyTests.length) history.push({ at: metrics.generatedAt, env: metrics.env, tests: metrics.flakyTests });
fs.writeFileSync(historyFile, JSON.stringify(history.slice(-50), null, 2));

const md = [
  `### Test metrics (${metrics.env})`,
  `| Total | Passed | Failed | Flaky | Skipped | Pass rate | Duration | Healed locators |`,
  `|---|---|---|---|---|---|---|---|`,
  `| ${metrics.total} | ${metrics.passed} | ${metrics.failed} | ${metrics.flaky} | ${metrics.skipped} | ${metrics.passRate}% | ${metrics.totalDurationSec}s | ${metrics.healedLocators} |`,
  '',
  '**Slowest tests**',
  ...metrics.slowest.map((t) => `- ${t.seconds}s - ${t.title} [${t.project}]`),
  ...(metrics.flakyTests.length ? ['', '**Flaky tests**', ...metrics.flakyTests.map((t) => `- ${t.title} [${t.project}]`)] : []),
].join('\n');
fs.writeFileSync(path.join(RESULTS_DIR, 'metrics.md'), md);
console.log(md);
