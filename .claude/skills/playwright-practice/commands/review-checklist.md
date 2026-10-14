# Pre-Finish Checklist

Run these before marking work done:

```bash
# Verify the TAS (typecheck + lint + anti-patterns + unit tests)
npm run verify

# Discover tests
npx playwright test tests/suites/RahulShettyClient/Test/<your-file>.spec.ts --list

# Verify anti-patterns (expect 0 matches)
grep -r "waitForTimeout" tests/suites/
grep -r "expect(await" tests/suites/
grep -r "page\.\$" tests/suites/
grep -r "\.only(" tests/suites/

# Run your tests
npm run test:test -- tests/suites/RahulShettyClient/Test/<your-file>.spec.ts
```

## Code checks
- [ ] Specs import `{ test, expect }` from `../fixtures`
- [ ] Pages extend `<Suite>BasePage`
- [ ] New page registered in suite `fixtures.ts`
- [ ] Data in ALL `data/<env>/` folders (dev, test, staging, prod)
- [ ] Titles follow `TCxx: description (positive|negative)`
- [ ] Phases wrapped in `test.step`
- [ ] Selectors follow priority (role > label > placeholder > text > testid)
- [ ] Assertions are web-first `await expect()`
- [ ] No hard waits, `.only`, or raw CSS (unless third-party + comment)
- [ ] `npm run verify` passes
- [ ] New core code has a spec in `tests/unit/`
- [ ] Suite config via `createSuiteConfig`, page fixtures via `pageFixture` (no copy-paste)
- [ ] No `healed` annotations left in the run (fix the primary locator)
