# Debugging Flaky Tests

1. **Reproduce:** `npx playwright test <file> --repeat-each=10 --project=chromium`
2. **Inspect:** `npx playwright show-report` or `npx playwright show-trace <trace.zip>`
3. **Replace** hard waits with web-first assertions on the real condition
4. **Replace** position-based selectors (`.nth`, `.first`) with `filter({ hasText })` or roles
5. **Check** shared state: unique data with `{{timestamp}}`; don't depend on test order
6. **Auth:** Fresh token per worker or `storageState`; never reuse tokens
7. **Navigation race:** `await expect(page).toHaveURL(...)` after click
8. **Animations:** Wait for actionable state, don't force-click
9. **Selectors:** Use priority order; avoid CSS for semantic elements

## Commands
```bash
npx playwright test <file> --debug                     # Inspector
npx playwright test <file> --ui                        # Interactive
npx playwright test <file> --project=chromium -g "TC01"  # By title
npx playwright show-report
```

## Anti-Patterns to Avoid
- `waitForTimeout` (hard wait)
- `expect(await el.isVisible())` (no retry)
- `page.$/.$$` (deprecated)
- `.nth()` without comment (order-dependent)
- `try/catch` around `expect` (masks failures)
