# Playwright Test Automation Framework (TAF)

End-to-end and API test automation built with **Playwright 1.63** and **TypeScript**.

- 🧱 **SOLID architecture** (ISTQB CTAL-TAE ch.3): layered core, page objects and API clients injected through fixtures
- 🔐 **API login**: tests get a session token from the REST API instead of filling in the login form
- 🗂️ **JSON data-driven, multi-environment**: `dev` / `test` / `staging` / `prod` data and URLs per suite
- 📸 **Failure capture**: a screenshot and the per-test log are attached to the reports when a test fails
- 🎯 **Allure, HTML, JUnit and JSON reports**
- ⚡ **Fast CI**: Chromium by default, cached browsers, parallel workers

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
│   ├── config/EnvConfig.ts            # loadEnvConfig(suiteDir) → config/env.config.json[ENV]
│   ├── data/DataLoader.ts             # loadData(suiteDir, file) → data/<ENV>/<file> + {{timestamp}}
│   ├── env.ts                         # TEST_ENV selector (default: test)
│   ├── fixtures.ts                    # Base test: logger, autoScreenshot, failure capture
│   ├── TestDataFactory.ts             # faker re-export
│   └── globalSetup.ts                 # Wipes old results/reports before each run
│
├── suites/
│   ├── RahulShettyClient/             # Register → API login → cart → checkout
│   │   ├── api/AuthApi.ts             # POST /auth/login, getToken()
│   │   ├── config/
│   │   │   ├── env.config.json        # baseUrl + apiBaseUrl per env
│   │   │   └── ClientConfig.ts        # Typed config + SUITE_DIR
│   │   ├── data/
│   │   │   ├── TestData.ts            # Typed models + resolveCredentials()
│   │   │   └── {dev,test,staging,prod}/
│   │   │       ├── users.data.json    # Shared credentials (single source)
│   │   │       ├── login.data.json    # 4 API login cases
│   │   │       ├── cart.data.json     # Products + userRef
│   │   │       └── e2e.data.json      # New user, product, checkout data
│   │   ├── pages/                     # ClientBasePage, LoginPage, RegisterPage, AddToCartPage, CheckoutPage
│   │   ├── fixtures.ts                # Injects page objects + AuthApi
│   │   └── Test/                      # login.spec.ts, addToCart.spec.ts, e2eValidFlow.spec.ts
│   │
│   ├── SauceDemo/                     # Login → inventory
│   │   ├── config/ data/ pages/       # SauceDemoBasePage, LoginPage, InventoryPage
│   │   ├── fixtures.ts
│   │   └── Test/login.spec.ts
│   │
│   ├── TestAutomationPractice/        # Browser dialogs (alert / confirm / prompt)
│   │   ├── config/ data/ pages/       # AlertsPage
│   │   ├── fixtures.ts
│   │   └── Test/alertsHandling.spec.ts
│   │
│   └── SpecialLocators/               # Locator strategies (Angular practice form + shop)
│       ├── data/form.data.json
│       ├── pages/AngularPracticePage.ts
│       ├── fixtures.ts
│       └── SpecialLocators.spec.ts
│
└── Typescript_Fundamentals/           # TypeScript language practice
```

**Layers (gTAA):** specs (test definition) → suite fixtures (wiring) → page objects / API clients (adaptation) → core (framework services).

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

This repo includes a **Playwright best practices skill** at `.claude/skills/playwright-practice/` for use with Claude Code. The skill provides:

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

**Load it:** Claude Code auto-discovers it via `CLAUDE.md` at the repo root.

---

## Setup

```bash
npm install
npx playwright install          # first time only
```

## Running Tests

```bash
npm test                                          # all tests, all browsers
npx playwright test tests/suites --project=chromium
npx playwright test tests/suites/RahulShettyClient --project=chromium
npx playwright test tests/suites/RahulShettyClient/Test/login.spec.ts
npm run test:headed                               # see the browser
```

### Multi-Environment

`TEST_ENV` selects the environment (`dev`, `test` *(default)*, `staging`, `prod`). Each suite reads `config/env.config.json[TEST_ENV]` and `data/<TEST_ENV>/*.json`.

```bash
npm run test:dev        # RahulShettyClient against dev (also test:test, test:staging, test:prod)
$env:TEST_ENV='staging'; npx playwright test tests/suites     # PowerShell
TEST_ENV=staging npx playwright test tests/suites             # bash
```

Test titles include the environment (`RahulShettyClient - Login API [dev]`). The RahulShettyClient E2E test is **skipped on prod** because it creates users and orders.

**Adding an environment:** add an entry to each suite's `env.config.json`, create a `data/<env>/` folder with that suite's JSON files, and optionally add a `test:<env>` npm script. Also add the name to `validEnvs` in `tests/core/env.ts`.

### Reports

```bash
npm run test:report                  # Playwright HTML report
npm run test:report:allure           # generate + open Allure
npx playwright show-trace test-results/<test-folder>/trace.zip
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
| TC05 | Add valid product, cart count +1, product in cart | Positive | UI (API login) | cart + users |
| TC06 | Search invalid product → "Showing 0 results", not in cart | Negative | UI (API login) | cart + users |
| E2E | Register → API login → add to cart → checkout → order confirmed | End-to-end | UI (API login) | e2e |

**How the API login works**

1. `AuthApi.getToken(email, password)` calls `POST /auth/login` and returns the JWT (or fails with the HTTP status and body).
2. `LoginPage.loginWithToken(token)` writes `localStorage.token` through `page.addInitScript`, so the token is in place before the app boots. If the app is already open (as in the E2E test, after registering), it reloads, because the app reads the token only at startup.
3. The test opens the dashboard already logged in. The login form is never used.

```typescript
test.beforeEach(async ({ authApi, loginPage, addToCartPage }) => {
  const { email, password } = resolveCredentials(users, cartData);
  await loginPage.loginWithToken(await authApi.getToken(email, password));
  await addToCartPage.goto();
});
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

**One source for credentials.** `users.data.json` holds the registered account. Other files point to it with `userRef`, and can override single fields:

```json
// users.data.json
{ "registeredUser": { "email": "autotest.tc01…@gmail.com", "password": "AutoTest@…" } }

// login.data.json (TC02 reuses the email, overrides the password)
{ "id": "TC02", "userRef": "registeredUser", "password": "WrongPassword@123",
  "expected": { "type": "error", "status": 400, "message": "Incorrect email or password." } }

// cart.data.json
{ "userRef": "registeredUser", "validProduct": "ZARA COAT 3", "invalidProduct": "NON EXISTENT PRODUCT" }
```

`resolveCredentials(users, source)` merges the referenced user with any overrides. A password change is now a one-line edit in each environment's `users.data.json`.

**Unique data per run.** `{{timestamp}}` in any data file is replaced by `Date.now()` when it's loaded (used for the E2E registration email).

**Adding a test case:** add a JSON row. The spec loops over the cases, so no code change is needed.

---

## Core Features

### Fixtures and dependency injection

`tests/core/fixtures.ts` provides `logger`, `autoScreenshot` and failure capture. Each suite extends it:

```typescript
// tests/suites/RahulShettyClient/fixtures.ts
export const test = base.extend<ClientFixtures>({
  loginPage: async ({ page, logger }, use) => use(new LoginPage(page, logger)),
  authApi:   async ({ request, logger }, use) => use(new AuthApi(request, logger)),
  // …
});
```

Specs import `test`/`expect` from **their suite's** `fixtures.ts`.

### Failure capture and logging

On failure, a full-page screenshot and the test's buffered log (`[ISO time] STEP: …`) are attached to the HTML and Allure reports. Specs that request `autoScreenshot` also save a screenshot to `tests/suites/<Suite>/screenshots/` (gitignored, wiped before each run).

### Self-healing locators

```typescript
await this.healingLocator.clickWithHealing(
  this.page.getByRole('button', { name: /^Simple Alert$/i }),
  [this.page.locator('#alertBtn'), this.page.locator('button[onclick="myFunctionAlert()"]')],
);
```

### Waiting strategy

The framework relies on Playwright's auto-waiting and **web-first assertions** (`await expect(locator).toHaveText(...)`). It doesn't use `networkidle`, `waitForTimeout`, `slowMo` or per-call timeouts. Timeouts are set once in `playwright.config.ts`.

See **Selector Priority** and **Flaky Test Debugging** in `.claude/skills/playwright-practice/references/` for detailed guidance.

---

## Configuration (`playwright.config.ts`)

| Setting | Value |
|---|---|
| `timeout` | 60 s per test |
| `expect.timeout` | 10 s (web-first assertions) |
| `navigationTimeout` / `actionTimeout` | 60 s |
| `trace` | `retain-on-failure` |
| `retries` | 1 on CI, 0 locally |
| `workers` | 50% of CPUs on CI, default locally |
| Reporters | html, json (`test-results/results.json`), junit, list, allure-playwright |
| Projects | chromium, firefox, webkit |

---

## CI/CD (GitHub Actions)

`.github/workflows/playwright.yml` runs on push to `main` / `Task*`, on PRs to `main`, and manually.

| Trigger | Environment | Browsers |
|---|---|---|
| push / pull_request | `test` | Chromium |
| Run workflow (manual) | choose `dev` / `test` / `staging` / `prod` | choose `chromium` or `all` |

**What makes it fast**

- Only the selected browsers are installed, and they're **cached** (`~/.cache/ms-playwright`). On a cache hit, only the OS dependencies are installed.
- Tests run in **parallel** (50% workers), with 1 retry and traces kept only for failures.
- No `slowMo` or fixed sleeps in specs.
- A newer push to the same branch **cancels** the older run (`concurrency`).
- One artifact upload instead of five. No blocking `show-report` step.

**Outputs**

- The job **fails when a test fails**.
- Artifact `reports-<env>-<browsers>` contains `playwright-report/`, `allure-report/` and `test-results/` (JUnit, JSON, traces).
- On PRs, a comment with passed / failed / flaky / skipped counts and a link to the run.

---

## Creating a New Suite

1. Create `tests/suites/MySuite/{config,data/<env>,pages,Test}` and `config/env.config.json`.
2. Pages extend `BasePage` (or a suite base), take `(page: Page, logger: ILogger)`, and implement `Navigable` if they have a URL:
   ```typescript
   export class MyPage extends BasePage implements Navigable {
     async goto() { await this.navigate(loadEnvConfig(SUITE_DIR).baseUrl); }
   }
   ```
3. API clients extend `BaseApi`.
4. Add `fixtures.ts` that extends `tests/core/fixtures` and injects your pages/APIs.
5. Specs import from `../fixtures`, load data with `loadData`, and assert with web-first `expect`.

---

## Troubleshooting

- **Timeouts**: open the trace (`npx playwright show-trace …`). Prefer fixing the wait condition over raising timeouts.
- **WebKit crashes/out-of-memory locally**: run with fewer workers (`--workers=2`).
- **API login fails**: the error shows the HTTP status and body. Check `users.data.json` for the environment.
- **Allure report missing**: `npm run allure:generate`, then `npm run allure:open`.
