# Assertions and Waits

Web-first assertions retry until `expect.timeout` (10s in `playwright.config.ts`).

```ts
await expect(page.getByRole('alert')).toHaveText('Saved');   // good
await expect(page).toHaveURL(/dashboard/);                   // good
expect(await page.textContent('.msg')).toBe('Saved');        // bad: no retry
```

| Don't | Do | Why |
|---|---|---|
| `page.waitForTimeout(3000)` | `await expect(locator).toBeVisible()` | Hard waits are flaky |
| `expect(await el.isVisible())` | `await expect(el).toBeVisible()` | Enables retry |
| `page.$('.btn')` | `page.getByRole('button')` | Auto-wait + resilient |
| `try/catch` assertion | Let it fail | Hides real failures |

## Repo timeouts
- Test: 60s
- Expect: 10s  
- Action/navigation: 60s
- Raise per-test with `test.setTimeout(ms)` if needed
