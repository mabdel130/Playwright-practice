# Claude Code for Playwright Practice

## Skills
- `.claude/skills/playwright-practice/` — Best practices reference for this repo: selectors, assertions, repo conventions, API login, debugging flaky tests, and copy-paste templates. Use when working on specs, pages, APIs, test data, or failures.

## Project Notes
- All page objects use ID-based selectors for the third-party Rahul Shetty Academy app (no semantic labels available)
- This is documented in the skill as acceptable for third-party widgets
- Follow the skill checklist before finishing any work

## Quick start
```bash
npm run test:test                    # Run RahulShettyClient suite in test env
npx playwright test --ui             # Interactive mode
npm run allure:generate && npm run allure:open
```

See `.claude/skills/playwright-practice/` for full reference.
