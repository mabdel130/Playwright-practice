# Test Automation Strategy (ISTQB CTAL-TAE ch.2 - Preparing for Test Automation)

This repo is a **practice framework**. The applications under test are public third-party training sites, so this document records the decisions that would normally be made before starting a real automation project.

## 1. Objectives

| Objective | How it is measured |
|---|---|
| Learn and demonstrate a maintainable Playwright + TypeScript framework | `npm run verify` stays green; no copy-pasted setup between suites |
| Fast, repeatable regression for the covered flows | Pass rate and duration in `test-results/metrics.json` |
| Stable tests | Zero entries added to `test-results/flaky-history.json` per sprint |

## 2. What is automated, and what is not

| Candidate | Decision | Reason |
|---|---|---|
| Login (API and UI) on Rahul Shetty client, SauceDemo | Automate | Stable, repeated, high value, easy to data-drive |
| Register, add to cart, checkout (E2E) | Automate | Core business flow; runs once per build |
| Browser dialogs (alert / confirm / prompt) | Automate | Cheap, deterministic, good locator-healing practice |
| Locator strategy practice (Angular form and shop) | Automate | Teaching suite for special locators |
| Visual look and feel, exploratory checks, accessibility audits | Keep manual | Judgement needed; little return from scripts |
| Payment with real providers, email delivery | Out of scope | Not available on the training sites |

Candidates are scored on: frequency of execution, stability of the feature, determinism of the result, and cost to automate. Anything low on the first three stays manual.

## 3. Tool selection: why Playwright + TypeScript

| Need | Playwright answer |
|---|---|
| Cross-browser (Chromium, Firefox, WebKit) | Built in, one API |
| Reliable waits | Auto-waiting actions and web-first assertions (`await expect(...)`) |
| UI and API in one tool | `request` fixture used for API login |
| Parallelism, retries, traces | Built into the runner |
| Reporting | HTML, JSON, JUnit, plus Allure through `allure-playwright` |
| Type safety | TypeScript with `strict` |

Known limits, accepted: no native mobile apps (only browser emulation), desktop apps not supported, and a test-runner lock-in to `@playwright/test`.

## 4. Testability of the applications under test

| Application | Observations | Mitigation |
|---|---|---|
| rahulshettyacademy.com/client | Few semantic labels; mostly IDs and CSS classes | ID-based selectors, documented as acceptable for third-party widgets; self-healing backups |
| saucedemo.com | Stable ids and `data-test` attributes | Use them |
| testautomationpractice.blogspot.com | Dialogs and tables with mixed ids | Role-based locators first, ids as backup |
| rahulshettyacademy.com/angularpractice | Angular form, role and placeholder locators available | Prefer role/label/placeholder |

Risks: the sites are public and can change or go offline without notice. Pre-flight warns when a base URL is unreachable; set `PREFLIGHT_STRICT=1` to make that fail the run.

## 5. Test environments and data

- Environments: `dev`, `test`, `staging`, `prod`. The training sites have one real instance, so all four point to the same URLs. The structure is kept so a real project only changes `env.config.json` and the data files.
- Selected with `TEST_ENV` (default `test`). Pre-flight verifies every suite has an entry and the same data files for each environment.
- Data is JSON per suite and environment, with `{{timestamp}}` placeholders for unique values.
- Credentials in the data files belong to throwaway training accounts. Real secrets would go in CI secrets, never in the repo.

## 6. Pilot scope and rollout

1. **Pilot**: RahulShettyClient login and cart (API login, data-driven).
2. **Expand**: E2E checkout, SauceDemo, dialogs, special locators.
3. **Harden**: static analysis, unit tests of the framework, pre-flight (ch.7).
4. **Improve**: metrics, flaky tracking, dependency updates (ch.8).

## 7. Roles and maintenance

One owner (the repository author) writes and maintains tests and the framework. Maintenance cadence: Dependabot weekly, a scheduled CI run weekly, and `npm run verify` before every pull request.

## 8. Risks and contingencies

| Risk | Impact | Contingency |
|---|---|---|
| Target site changes a locator | Test fails | Self-healing backups log a `healed` annotation; fix the primary locator |
| Target site down or slow | Many failures | Pre-flight warning; re-run; do not raise timeouts as a fix |
| Flaky tests | Loss of trust | Track in `flaky-history.json`; fix or quarantine with `test.fixme` |
| Dependency or browser update breaks tests | Failing CI | Dependabot PRs run the full pipeline before merge |
