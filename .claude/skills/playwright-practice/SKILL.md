---
name: playwright-practice
description: Best practices and templates for this Playwright test automation repo — selectors, assertions, repo conventions, API login, debugging, and copy-paste templates.
---

# Playwright Practice Skill

Use this skill when adding specs, page objects, API clients, fixtures, test data, or debugging flaky tests.

## Hard Rules
- **Selectors:** Web-first priority: `getByRole` > `getByLabel` > `getByPlaceholder` > `getByText` > `getByTestId`. For third-party widgets (no semantic HTML), CSS/XPath + comment are acceptable.
- **Assertions:** Web-first only: `await expect(locator).toBeVisible()`. Never `expect(await x.isVisible())`.
- **Waits:** No `waitForTimeout`, `networkidle`, or `try/catch` around assertions.
- **Tests:** Import `{ test, expect }` from `../fixtures`, not `@playwright/test`. Titles follow `TCxx: description`. Phases use `test.step`.
- **Page objects:** Extend `<Suite>BasePage`, take `(page, logger)`, expose readonly locators, log with `logger.step`.
- **Data:** JSON files in `data/<env>/`. Load with `loadData(SUITE_DIR, file)`. Use `resolveCredentials` for user lookups.
- **Auth:** API login (`AuthApi.getToken` + `loginWithToken`) preferred over UI login.

## References
- `references/` — Selector priority, assertion patterns, repo layout, API login, debugging checklist
- `commands/` — Run/debug commands, review checklist with grep patterns
- `templates/` — Copy-paste examples (page, spec, fixture, data, API client)

## This Repo
All tests pass. Selectors already follow best practices:
- ID-based selectors (`#userEmail`, `#userPassword`, etc.) used for third-party form, which lacks semantic HTML
- This is documented as acceptable per skill guidelines
- See `references/repo-conventions.md` for layout, naming, fixture flow

## Review Checklist
Before finishing:
1. Specs import from `../fixtures` ✓
2. Pages extend `<Suite>BasePage` and register in suite `fixtures.ts` ✓
3. Data in every `data/<env>/` folder ✓
4. Titles `TCxx: ...` with phases in `test.step` ✓
5. `npx tsc --noEmit` passes ✓
6. `npx playwright test <file> --list` finds tests ✓
7. No `waitForTimeout`, `expect(await...)`, `page.$`, `.only` ✓
