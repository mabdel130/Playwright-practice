// Static anti-pattern scan (ISTQB TAE ch.7 - verify test scripts). Exit 1 on any hit.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'tests', 'suites');
const RULES = [
  { name: 'hard wait (waitForTimeout)', re: /waitForTimeout\s*\(/ },
  { name: 'focused test (.only)', re: /\b(test|describe)\.only\s*\(/ },
  { name: 'non-web-first assertion (expect(await ...))', re: /expect\(\s*await\s/ },
  { name: 'element handle ($ / $$)', re: /\bpage\.\$\$?\s*\(/ },
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === 'screenshots' ? [] : walk(full);
    return e.name.endsWith('.ts') ? [full] : [];
  });
}

const hits = [];
for (const file of walk(ROOT)) {
  fs.readFileSync(file, 'utf-8').split(/\r?\n/).forEach((line, i) => {
    for (const rule of RULES) {
      if (rule.re.test(line)) hits.push(`${path.relative(process.cwd(), file)}:${i + 1}  ${rule.name}`);
    }
  });
}

if (hits.length) {
  console.error(`Anti-patterns found (${hits.length}):\n${hits.map((h) => '  ' + h).join('\n')}`);
  process.exit(1);
}
console.log('check-antipatterns: OK');
