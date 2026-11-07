# Playwright Test Automation Framework (TAF)

End-to-end and API test automation built with **Playwright 1.63** and **TypeScript**.

- 🧱 **SOLID architecture** (ISTQB CTAL-TAE ch.3): layered core, page objects and API clients injected through fixtures
- 🔐 **API login**: tests get a session token from the REST API instead of filling in the login form
- 🧪 **Isolated sessions**: UI tests register a fresh user through the API, so every test starts with an empty cart and no old orders
- ♻️ **Reusable flows**: login precondition (`loginAsValidUser`) and cart → checkout → order (`checkoutFlow`) are written once and shared by specs
- 🗂️ **JSON data-driven, multi-environment**: `dev` / `test` / `staging` / `prod` data and URLs per suite
- 📸 **Screenshot for every test**: attached to the HTML and Allure reports; the per-test log is also attached when a test fails
- 🎯 **Allure, HTML, JUnit and JSON reports**
- ⚡ **Simple CI**: runs on every PR, plus a bi-weekly health check; Chromium by default
- ✅ **Verified framework** (ISTQB CTAL-TAE ch.7): typecheck, ESLint, anti-pattern scan, unit tests and a pre-flight setup check
- 📈 **Continuous improvement** (ISTQB CTAL-TAE ch.8): metrics, flaky and Allure history, self-healing visibility

---

## Project Structure

```
tests/
├── core/                              # Shared framework layer (no suite knowledge)
│   ├── BasePage.ts                    # Abstract page base: navigate / fill / click / select
│   ├── Logger.ts                      # ILogger interface + buffered Logger
│   ├── SelfHealingLocator.ts          # Primary + backup locator strategies
│   ├── contracts.ts                   # Navigable interface (pages that have a URL)
│   ├── api/BaseApi.ts                 # Abstract API client (request, baseUrl, logger, post)
│   ├── config/EnvConfig.ts            # loadEnvConfig(suiteDir), createSuiteConfig(__dirname)
│   ├── data/DataLoader.ts             # loadData(suiteDir, file) → data/<ENV>/<file> + {{timestamp}}
│   ├── env.ts                         # parseEnv() + ENV (TEST_ENV, default: test)
│   ├── fileName.ts                    # sanitizeFileName() for screenshot names
│   ├── fixtures.ts                    # Base test: logger, auto autoScreenshot, failure capture
│   ├── pageFixture.ts                 # pageFixture(PageClass) → one-line suite fixtures
│   ├── preflight.ts                   # Static setup checks (env entry, data files per env, JSON)
│   └── globalSetup.ts                 # Pre-flight, then wipes old results (keeps trend history)
│
├── suites/
│   ├── RahulShettyClient/             # Register → API login → cart → checkout → orders
│   │   ├── api/AuthApi.ts             # POST /auth/register, POST /auth/login, getToken()
│   │   ├── config/
│   │   │   ├── env.config.json        # baseUrl + apiBaseUrl per env
│   │   │   └── ClientConfig.ts        # Typed config + SUITE_DIR
│   │   ├── data/
│   │   │   ├── TestData.ts            # Typed models + resolveCredentials()
│   │   │   └── {dev,test,staging,prod}/
│   │   │       ├── users.data.json    # Registered account for the login API tests
│   │   │       ├── login.data.json    # 4 API login cases (1 valid, 3 invalid)
│   │   │       ├── cart.data.json     # Valid / invalid product
│   │   │       ├── e2e.data.json      # New user, product, checkout data
│   │   │       └── order.data.json    # Products (name + product ID) and checkout data
│   │   ├── pages/                     # ClientBasePage, LoginPage, RegisterPage, AddToCartPage, CheckoutPage, OrdersPage
│   │   ├── flows/CheckoutFlow.ts      # Reusable cart → checkout → place order steps
│   │   ├── fixtures.ts                # Injects pages, AuthApi, checkoutFlow, loginAsValidUser
│   │   └── Test/                      # login, addToCart, e2eValidFlow, orderFlow specs
│   │
│   ├── SauceDemo/                     # Login → inventory
│   │   ├── config/ data/ pages/       # SauceDemoBasePage, LoginPage, InventoryPage
│   │   ├── fixtures.ts
│   │   └── Test/login.spec.ts
│   │
│   ├── TestAutomationPractice/        # Browser dialogs (alert / confirm / prompt)
│   │   ├── config/ data/ pages/       # TestAutomationPracticeBasePage, AlertsPage
│   │   ├── fixtures.ts
│   │   └── Test/alertsHandling.spec.ts
│   │
│   └── SpecialLocators/               # Locator strategies (Angular practice form + shop)
│       ├── config/env.config.json
│       ├── data/{dev,test,staging,prod}/form.data.json
│       ├── pages/                 # SpecialLocatorsBasePage, AngularPracticePage
│       ├── fixtures.ts
│       └── SpecialLocators.spec.ts
│
├── unit/                              # Browser-less tests of tests/core (project: unit)
│   └── env, selfHealingLocator, dataAndConfig, preflight specs
│
└── Typescript_Fundamentals/           # TypeScript language practice (excluded from typecheck/lint)

scripts/
├── check-antipatterns.js              # Fails on waitForTimeout, .only, expect(await …), page.$
└── metrics.js                         # results.json → metrics.json / metrics.md / flaky-history.json
eslint.config.mjs                      # typescript-eslint + eslint-plugin-playwright
.github/workflows/playwright.yml       # CI: verify job, then browser tests
```

**Layers (gTAA):** specs (test definition) → suite fixtures (wiring) → page objects / API clients (adaptation) → core (framework services).

---

## Architecture (ISTQB CTAL-TAE ch.3 - gTAA)

How this repo maps to the generic Test Automation Architecture:

| gTAA layer | In this repo |
|---|---|
| Test generation | Hand-written specs; test cases come from JSON rows (`data/<env>/*.json`) and `createSuiteConfig` / `loadData` |
| Test definition | `tests/suites/*/Test/*.spec.ts` and suite `fixtures.ts` - what to test, in `test.step` phases, with web-first assertions |
| Test execution | Playwright runner configured in `playwright.config.ts`, `tests/core/globalSetup.ts` (pre-flight, cleanup) and the GitHub Actions workflow |
| Test adaptation | Page objects (`pages/`) and API clients (`api/`) built on `BasePage` / `BaseApi`; `SelfHealingLocator` |
| Reporting and logging | `Logger`, failure attachments, Playwright/Allure/JUnit/JSON reporters, `scripts/metrics.js` |
| Configuration and environment | `TEST_ENV`, `config/env.config.json`, `tests/core/env.ts`, `tests/core/config/EnvConfig.ts` |

Every suite has the same shape: `config/`, `data/<env>/`, `pages/<Suite>BasePage.ts` (loads the base URL through `createSuiteConfig`), page objects, `fixtures.ts` built with `pageFixture`, and the specs. Pages never call each other and specs never build dependencies - both rules keep the layers separate.

Before automating anything new, read [docs/test-automation-strategy.md](docs/test-automation-strategy.md) (ISTQB CTAL-TAE ch.2: scope, tool choice, testability, environments, risks).

---

## Design Principles — SOLID (ISTQB CTAL-TAE ch.3)

| Principle | Where it is applied |
|---|---|
| **S** — Single Responsibility | `EnvConfig.ts` only loads configuration, `DataLoader.ts` only loads test data, `Logger` only records logs. Page objects own locators and UI actions, `AuthApi` owns HTTP calls, and specs only describe the test and its assertions. |
| **O** — Open/Closed | `BaseApi` is closed for modification and open for extension: a new endpoint group (e.g. an `OrderApi`) extends it without changing `AuthApi` or core. New login cases are new JSON rows, with no code change. |
| **L** — Liskov Substitution | `BasePage` exposes a `protected navigate(url)`. Page subclasses add their own `goto()` instead of overriding a base `goto(url)` with a different signature, so any subclass can stand in for `BasePage`. |
| **I** — Interface Segregation | `Navigable { goto() }` is implemented only by pages that have their own URL (`LoginPage`, `AddToCartPage`, `AlertsPage`, …). `CheckoutPage` is reached through the flow and doesn't have to implement it. |
| **D** — Dependency Inversion | Page objects, `BaseApi` and `SelfHealingLocator` depend on the `ILogger` abstraction. Specs never `new` their dependencies: each suite's `fixtures.ts` builds and injects page objects and API clients (`async ({ loginPage, authApi }) => …`). |

Other patterns used: **Page Object Model**, **Facade** (`AuthApi.getToken()` hides request, status check and parsing), **data-driven testing** with typed JSON models.

---

## Claude Code Skill

A **Playwright best practices skill** lives at `.claude/skills/playwright-practice/` for use with Claude Code. The `.claude/` folder is **local only** (listed in `.gitignore`), so it isn't part of a fresh clone. The skill provides:

- **References:** selector priority, assertion patterns, repo conventions, API login, flaky test debugging
- **Commands:** run/debug commands, pre-finish checklist with grep patterns
- **Templates:** copy-paste examples (page object, spec, fixture, data file, API client)

The skill documents that this project already follows best practices:
- **Selector priority:** ID-based selectors for third-party forms (no semantic HTML), role-based for accessible elements
- **Web-first assertions:** `await expect(locator).toBeVisible()` throughout
- **No anti-patterns:** no `waitForTimeout`, `expect(await...)`, or `.only` commits

Use the skill when:
- Adding a new spec, page object, API client, or test data
- Debugging a flaky test
- Reviewing someone else's test code

**Load it:** Claude Code auto-discovers it via a local `CLAUDE.md` at the repo root. Both `CLAUDE.md` and `.claude/` are gitignored.

---

## Setup

```bash
npm install
npx playwright install          # first time only
```

## Running Tests

```bash
npm test                                          # all tests (unit + all browsers)
npm run verify                                    # typecheck + lint + anti-patterns + unit tests (no browser)
npx playwright test tests/suites --project=chromium
npx playwright test tests/suites/RahulShettyClient --project=chromium
npx playwright test tests/suites/RahulShettyClient/Test/login.spec.ts
npx playwright test --headed                      # see the browser while running
npx playwright test --headed --project=chromium   # headed mode, single browser
```

### Debugging: API responses, localStorage and the Network tab

```bash
npm run test:debug -- tests/suites/RahulShettyClient/Test/addToCart.spec.ts   # headed, 1 worker, DevTools open
DEBUG_API=1 npx playwright test ...                                           # only print/attach, no DevTools
```

- `DEBUG_API=1` prints each API response (status + body) and the page `localStorage` after every `gotoRoute`, and attaches both to the test report (`api-response POST /auth/login`, `localStorage /dashboard/dash`). It is off by default because the output contains the login token.
- `DEVTOOLS=1` opens Chrome DevTools on every tab (Chromium only), so the Network tab records the browser traffic from the first request.
- `DEBUG_API=1` also keeps a **trace for every test**. Open it with `npx playwright show-trace test-results/<test-folder>/trace.zip`: its **Network** tab lists every request (including the API login) with headers and response body, next to a screenshot of the page at each step. Playwright cannot screenshot Chrome DevTools itself, so this is the way to get a Network view you can capture.
- API login uses Playwright's `request` fixture, not the browser, so it does **not** appear in the Network tab. Read it from the console or the report attachment. The token only reaches the browser when it is injected into `localStorage` (`LoginPage.loginWithToken`).

### Headed Mode (Watch Tests Run)
Run tests with the browser visible for debugging or observation:

```bash
npm run test:watch                                # RahulShettyClient, headed, slowMo 800, 1 worker, Chromium
npm run test:test -- tests/suites/RahulShettyClient --headed
npm run test:test -- tests/suites/SauceDemo --headed
npx playwright test --ui                          # interactive UI mode
```

- The flag is `--headed` with no space. `npx playwright test -- headed` treats `headed` as a test filter, runs nothing and writes no reports.
- `SLOWMO=<ms>` slows every action down (read by `playwright.config.ts`, default `0`). Raise the test timeout too, e.g. `--timeout=300000`.

### Multi-Environment

`TEST_ENV` selects the environment (`dev`, `test` *(default)*, `staging`, `prod`). Each suite reads `config/env.config.json[TEST_ENV]` and `data/<TEST_ENV>/*.json`.

```bash
npm run test:dev        # RahulShettyClient against dev (also test:test, test:staging, test:prod)
$env:TEST_ENV='staging'; npx playwright test tests/suites     # PowerShell
TEST_ENV=staging npx playwright test tests/suites             # bash
```

Test titles include the environment (`RahulShettyClient - Login API [dev]`). RahulShettyClient UI tests (E2E, cart, order flow) are **skipped on prod** where they create users and orders.

**Adding an environment:** add an entry to each suite's `env.config.json`, create a `data/<env>/` folder with that suite's JSON files, and optionally add a `test:<env>` npm script. Also add the name to `validEnvs` in `tests/core/env.ts`.

### Reports

**Playwright HTML Report** (detailed test timeline, screenshots, videos, traces):
```bash
npm run test:report                  # generate + open Playwright HTML
npx playwright show-report           # open existing report
```

**Allure Report** (executive summary, trends, attachments):
```bash
npm run allure:generate              # build allure-report/index.html (single file) from allure-results
npm run allure:open                  # open Allure in browser
npm run test:report:allure           # generate + open Allure
npm run report:all                   # generate Allure, then open the Playwright HTML report
```

- The Allure HTML **does not update by itself**: run `npm run allure:generate` after every test run. It is built as a single file, so `allure-report/index.html` also opens directly from disk.
- Don't pass `--reporter=...` on the command line: it replaces all reporters in the config, so neither the HTML nor the Allure report is written.

**Trace Inspection** (detailed step-by-step execution):
```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

**Run in Headed Mode + Generate Reports:**
```bash
# Run tests with browser visible, then generate both reports
npm run test:test -- tests/suites/RahulShettyClient --headed
npm run test:report
npm run allure:generate && npm run allure:open
```

---

## Viewing Test Results

After running tests, view results in different formats:

| Report | Purpose | Open |
|--------|---------|------|
| **Playwright HTML** | Timeline, screenshots, videos, traces | `npx playwright show-report` |
| **Allure** | Executive summary, test matrix, trends | `npm run allure:open` |
| **JUnit** | CI/CD integration (Jenkins, GitLab, etc.) | `test-results/junit.xml` |
| **JSON** | Programmatic parsing | `test-results/results.json` |
| **Traces** | Step-by-step execution details | `npx playwright show-trace <trace.zip>` |

**Example workflow:**
```bash
# 1. Run tests with headed browser
npm run test:test -- tests/suites/RahulShettyClient tests/suites/SauceDemo --headed

# 2. View Playwright report (timeline + screenshots)
npx playwright show-report

# 3. View Allure report (executive summary)
npm run allure:open

# 4. Inspect specific test trace
npx playwright show-trace test-results/suites-RahulShettyClient-Test-e2e-test-chromium/trace.zip
```

---

## Test Suites

### 1. RahulShettyClient — E-commerce (API + UI, data-driven)

**URL:** https://rahulshettyacademy.com/client/ · **API:** `https://rahulshettyacademy.com/api/ecom`

| ID | Test | Technique | Layer | Data |
|----|------|-----------|-------|------|
| TC01 | Valid login returns token + userId | Positive | API | login + users |
| TC02 | Valid email, wrong password → 400 | Equivalence partitioning | API | login + users |
| TC03 | Unregistered email → 400 | Equivalence partitioning | API | login |
| TC04 | Empty email and password → 400 `Email is required` | Boundary | API | login |
| TC05 | Add valid product, cart count +1, product in cart | Positive | UI (isolated user) | cart |
| TC06 | Search invalid product → "Showing 0 results", not in cart | Negative | UI (isolated user) | cart |
| TC11 | Product IDs (via "View") match JSON → add 2 products → checkout → API response product IDs match JSON → Orders tab lists exactly these orders → "View" each order | End-to-end | UI + API (isolated user) | order |
| E2E | Register → API login → add to cart → checkout → order confirmed | End-to-end | UI (API login) | e2e |

The login API tests render their request and response in the browser, so their screenshot shows the evidence (the token is masked).

**Login precondition: `loginAsValidUser`**

Written once in `fixtures.ts` and called from `beforeEach` in any spec that needs a logged-in user:

1. Builds a unique user and registers it with `AuthApi.register()` (`POST /auth/register`).
2. `AuthApi.getToken()` calls `POST /auth/login` and returns the JWT (or fails with the HTTP status and body).
3. `LoginPage.loginWithToken(token)` writes `localStorage.token` through `page.addInitScript`, so the token is in place before the app boots. If the app is already open, it reloads, because the app reads the token only at startup.
4. Opens the dashboard and checks the URL. The login form is never used.

Because every test gets its own user, tests can run in parallel without sharing a cart or seeing each other's orders.

```typescript
test.beforeEach(async ({ loginAsValidUser }) => {
  await loginAsValidUser();
});
```

**Reusable checkout: `checkoutFlow`**

`flows/CheckoutFlow.ts` holds the steps shared by the E2E and order-flow specs: `addProductsToCart`, `goToCartAndProceedToCheckout`, `fillCheckoutDetails`, `placeOrder` (returns the order and product IDs from the `create-order` API response), and `purchase`, which runs them all:

```typescript
const { orderIds, productIds } = await checkoutFlow.purchase(productNames, checkout, shippingName);
```

### 2. SauceDemo — Login

**URL:** https://www.saucedemo.com/ · `standard_user` logs in and lands on `inventory.html` with the "Swag Labs" logo (`InventoryPage`).

### 3. TestAutomationPractice — Dialogs

**URL:** https://testautomationpractice.blogspot.com/ · simple alert, confirm and prompt (with input from `alerts.data.json`). `AlertsPage` waits for the `dialog` event alongside the click instead of using fixed sleeps, and uses self-healing locators with backups.

### 4. SpecialLocators — Locator practice

**URL:** https://rahulshettyacademy.com/angularpractice/ · fills in the form, checks the success alert, adds the products from `form.data.json` and checks `Checkout ( 2 )`. It uses `getByRole`, `getByLabel`, `getByPlaceholder`, `.filter()` and chaining, all inside `AngularPracticePage`.

---

## JSON Data-Driven Testing

Data is loaded with the typed core loader. No spec reads files itself:

```typescript
const users      = loadData<UsersData>(SUITE_DIR, 'users.data.json');
const loginCases = loadData<LoginCase[]>(SUITE_DIR, 'login.data.json');
```

**One source for credentials.** `users.data.json` holds the registered account used by the login API tests. Login cases point to it with `userRef`, and can override single fields:

```json
// users.data.json
{ "registeredUser": { "email": "autotest.tc01…@gmail.com", "password": "AutoTest@…" } }

// login.data.json (TC02 reuses the email, overrides the password)
{ "id": "TC02", "userRef": "registeredUser", "password": "WrongPassword@123",
  "expected": { "type": "error", "status": 400, "message": "Incorrect email or password." } }

// order.data.json (product IDs are checked against the app)
{ "products": [{ "name": "ZARA COAT 3", "id": "6960eac0c941646b7a8b3e68" },
               { "name": "ADIDAS ORIGINAL", "id": "6960eae1c941646b7a8b3ed3" }],
  "checkout": { "cardNumber": "…", "country": "India" } }
```

`resolveCredentials(users, source)` merges the referenced user with any overrides. A password change is now a one-line edit in each environment's `users.data.json`.

**Unique data per run.** `{{timestamp}}` in any data file is replaced by `Date.now()` when it's loaded (used for the E2E registration email).

**Adding a test case:** add a JSON row. The spec loops over the cases, so no code change is needed.

---

## Core Features

### Fixtures and dependency injection

`tests/core/fixtures.ts` provides `logger`, `autoScreenshot` (automatic) and failure capture. Each suite extends it, using `pageFixture(PageClass)` from `tests/core/pageFixture.ts`:

```typescript
// tests/suites/RahulShettyClient/fixtures.ts
export const test = base.extend<ClientFixtures>({
  loginPage: async ({ page, logger }, use) => use(new LoginPage(page, logger)),
  authApi:   async ({ request, logger }, use) => use(new AuthApi(request, logger)),
  // …
});
```

Specs import `test`/`expect` from **their suite's** `fixtures.ts`.

### Screenshots and logging

- **Every test** gets a full-page screenshot through `screenshot: 'on'` in `playwright.config.ts`. It shows at the top level of the test in both the HTML and Allure reports.
- The auto fixture `autoScreenshot` also saves one per test to `tests/suites/<Suite>/screenshots/` (gitignored, wiped before each run). No opt-in needed.
- Before the screenshot, an `afterEach` hook waits up to 5 s for network calls to settle, so it doesn't capture a "Loading..." page. It never fails a test.
- On failure, a failure screenshot and the test's buffered log (`[ISO time] STEP: …`) are attached as well.

### Self-healing locators

```typescript
await this.healingLocator.clickWithHealing(
  this.page.getByRole('button', { name: /^Simple Alert$/i }),
  [this.page.locator('#alertBtn'), this.page.locator('button[onclick="myFunctionAlert()"]')],
);
```

When a backup locator is used, the test is annotated `healed` (primary + backup), so it is counted in `metrics.json` even if the test passes. Treat it as a defect in the primary locator.

### Waiting strategy

The framework relies on Playwright's auto-waiting and **web-first assertions** (`await expect(locator).toHaveText(...)`). Specs don't use `networkidle`, `waitForTimeout` or per-call timeouts. Timeouts are set once in `playwright.config.ts`. The only `networkidle` wait is the best-effort one before the end-of-test screenshot, and `slowMo` is opt-in via `SLOWMO` for watching runs.

See **Selector Priority** and **Flaky Test Debugging** in `.claude/skills/playwright-practice/references/` for detailed guidance.

---

## Configuration (`playwright.config.ts`)

| Setting | Value |
|---|---|
| `timeout` | 60 s per test |
| `expect.timeout` | 10 s (web-first assertions) |
| `navigationTimeout` / `actionTimeout` | 60 s |
| `trace` | `retain-on-failure`; `on` when `DEBUG_API=1` |
| `screenshot` | `on`, full page (every test) |
| `launchOptions.slowMo` | `SLOWMO` env var, default `0` (all projects, Chromium included) |
| `fullyParallel` | `false` |
| `retries` | 2 on CI, 0 locally |
| `workers` | 1 on CI, default locally |
| Reporters | list, html, json (`test-results/results.json`), junit (`test-results/junit.xml`), allure-playwright |
| Projects | `unit` (no browser, `tests/unit`), chromium, firefox, webkit, Mobile Chrome, Mobile Safari |

Every browser project ignores `tests/unit/`, so unit tests run once, in the `unit` project only.

---

## CI/CD (GitHub Actions)

`.github/workflows/playwright.yml` has two jobs:

```
verify (npm run verify) ──passes──► test (browser tests in tests/suites)
```

**When it runs**

| Trigger | Environment | Browsers |
|---|---|---|
| Pull request to `main` | `test` | Chromium |
| Push to `main` / `Task*` | `test` | Chromium |
| Health check: days 1 and 15 of each month, 05:00 UTC | `test` | Chromium |
| Run workflow (manual) | choose `dev` / `test` / `staging` / `prod` | choose `chromium` or `all` |

**How it stays simple**

- `verify` is one step, `npm run verify`. If the framework is broken, browser tests don't run.
- Only the selected browsers are installed, with one `npx playwright install --with-deps` step (no browser cache, as Playwright recommends).
- A newer push to the same branch **cancels** the older run (`concurrency`).
- One artifact upload. No blocking `show-report` step.

**Outputs**

- The job **fails when a test fails**.
- Artifact `reports-<env>-<browsers>` contains `playwright-report/`, `allure-report/` and `test-results/` (JUnit, JSON, traces). It's kept for 14 days.
- On PRs, a comment with passed / failed / flaky / skipped counts, the metrics table and a link to the run. The same metrics go to the job summary.

## Verifying the TAS (ISTQB CTAL-TAE ch.7)

The framework verifies itself before it verifies the product. `npm run verify` runs:

| Check | What it catches |
|---|---|
| `npm run typecheck` | Type errors; `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns` are on |
| `npm run lint` | ESLint + `eslint-plugin-playwright` (hard waits, `.only`, non-web-first assertions, element handles, invalid titles) |
| `npm run check:antipatterns` | `scripts/check-antipatterns.js` - the review-checklist greps, as a failing check |
| `npm run test:unit` | Browser-less tests of `tests/core` in `tests/unit/` (self-healing, data/env loading, pre-flight, env parsing) |

**Pre-flight (`tests/core/preflight.ts`, run from `globalSetup`)**: fails fast if `TEST_ENV` is invalid, a suite has no entry for the env, a `data/<env>/` folder lacks files that `data/test/` has, or a data file is invalid JSON. Base URLs are probed with a HEAD request and only warn, unless `PREFLIGHT_STRICT=1`.

## Continuous improvement (ISTQB CTAL-TAE ch.8)

- **Metrics**: `npm run metrics` (after a run) reads `test-results/results.json` and writes `metrics.json` / `metrics.md`: pass rate, flaky count, duration, slowest tests, healed locators.
- **Self-healing visibility**: when a backup locator is used, the test gets a `healed` annotation (primary + backup), so healing is counted even in passing tests. Fix the primary locator when you see one.
- **Trends**: `globalSetup` keeps `allure-results/history` and `test-results/flaky-history.json`; CI restores and saves them between runs.
- **Flaky policy**: a test that appears twice in `flaky-history.json` is fixed or quarantined (`test.fixme` with a ticket) within the sprint. Never add retries to hide it.
- **Maintenance cadence**: the bi-weekly health check (days 1 and 15) shows drift and flakiness even when no code changes. Shared setup lives in `tests/core` (`createSuiteConfig`, `pageFixture`, `loadData`) - extend those instead of copying code between suites.

---

## Creating a New Suite

1. Create `tests/suites/MySuite/{config,data/<env>,pages,Test}` and `config/env.config.json`.
2. Pages extend `BasePage` (or a suite base), take `(page: Page, logger: ILogger)`, and implement `Navigable` if they have a URL:
   ```typescript
   export const { suiteDir: SUITE_DIR, config: { baseUrl } } = createSuiteConfig(__dirname); // in pages/ or config/
   export class MyPage extends BasePage implements Navigable {
     async goto() { await this.navigate(baseUrl); }
   }
   ```
3. API clients extend `BaseApi`.
4. Add `fixtures.ts` that extends `tests/core/fixtures` and injects your pages with `pageFixture(MyPage)` (APIs: `async ({ request, logger }, use) => use(new MyApi(request, logger))`).
5. Specs import from `../fixtures`, load data with `loadData`, and assert with web-first `expect`. Do not request `autoScreenshot`; it is automatic.
6. Put the same data files in all four `data/<env>/` folders; pre-flight fails the run if one is missing. Finish with `npm run verify`.

---

## Troubleshooting

- **Timeouts**: open the trace (`npx playwright show-trace …`). Prefer fixing the wait condition over raising timeouts.
- **WebKit crashes/out-of-memory locally**: run with fewer workers (`--workers=2`).
- **API login fails**: the error shows the HTTP status and body. Check `users.data.json` for the environment.
- **Allure report missing or old**: `npm run allure:generate`, then `npm run allure:open`.
- **Reports not updated after a run**: check the command for `-- headed` (should be `--headed`) or a `--reporter` override.
- **TC11 product ID mismatch**: the site re-created its products. Update the IDs in `order.data.json` (all envs).
- **Pre-flight failed at start**: the message names the suite and the missing env entry or data file. Fix it, or check `TEST_ENV`.
- **Pre-flight URL warnings offline**: expected; set `PREFLIGHT_STRICT=1` only when you want them to fail the run.
- **`npm run verify` fails on lint**: `npx eslint tests scripts --fix` handles the auto-fixable ones; the rest name the rule to read.
