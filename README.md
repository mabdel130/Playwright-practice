# Playwright Test Automation Framework (TAF)

Enterprise-grade end-to-end test automation built with **Playwright 1.63** and **TypeScript**, featuring:
- 🎯 **Allure Reporting** with rich attachments and detailed test metrics
- 📸 **Automatic Failure Capture** — screenshots + logs attached to reports on failure
- 🔧 **Reusable Core Libraries** — eliminate code duplication across test suites
- 📋 **Structured Logging** — per-test buffered logs with automatic Allure attachment
- 🧹 **Global Cleanup** — automatic purge of old results before each test run

## Project Structure

```
tests/
├── core/                                    # ← SHARED REUSABLE LIBRARIES (NEW)
│   ├── BasePage.ts                          # Unified page object base class
│   ├── Logger.ts                            # Per-test log buffering (INFO/STEP/ERROR)
│   ├── SelfHealingLocator.ts                # Self-healing locator strategy
│   ├── fixtures.ts                          # Custom test.extend() with auto-failure capture
│   ├── TestDataFactory.ts                   # Shared faker re-export
│   └── globalSetup.ts                       # Pre-test cleanup (allure-results, test-results, reports)
│
├── suites/                                  # ← ORGANIZED TEST SUITES (NEW)
│   ├── TestAutomationPractice/              # Alerts handling flow (Multi-Environment)
│   │   ├── pages/
│   │   │   └── AlertsPage.ts                # Extends core BasePage
│   │   ├── config/
│   │   │   └── env.config.json              # Environment URLs (dev/test/staging/prod)
│   │   ├── data/                            # Per-environment JSON test data
│   │   │   ├── dev/
│   │   │   │   └── alerts.data.json
│   │   │   ├── test/
│   │   │   │   └── alerts.data.json
│   │   │   ├── staging/
│   │   │   │   └── alerts.data.json
│   │   │   └── prod/
│   │   │       └── alerts.data.json
│   │   ├── Test/
│   │   │   └── alertsHandling.spec.ts       # 3 data-driven alert tests
│   │   ├── utils/
│   │   │   └── TestData.ts                  # Suite-specific alert test data
│   │   └── screenshots/                     # Auto-generated test screenshots
│   │       ├── Test 1 Handle Simple Alert [chromium].png
│   │       ├── Test 2 Handle Confirmation Alert [chromium].png
│   │       └── Test 3 Handle Prompt Alert with Input [chromium].png
│   │
│   ├── RahulShettyClient/                   # Register → Login → Add to Cart → Checkout (JSON Data-Driven)
│   │   ├── pages/
│   │   │   ├── ClientBasePage.ts            # Suite-specific base (gotoRoute, toastMessage)
│   │   │   ├── RegisterPage.ts              # Extends ClientBasePage
│   │   │   ├── LoginPage.ts
│   │   │   ├── AddToCartPage.ts
│   │   │   └── CheckoutPage.ts
│   │   ├── config/
│   │   │   └── env.config.json              # Environment URLs (dev/test/staging/prod)
│   │   ├── data/                            # Per-environment JSON test data
│   │   │   ├── dev/
│   │   │   │   ├── login.data.json          # 4 login test cases (dev)
│   │   │   │   ├── cart.data.json
│   │   │   │   └── e2e.data.json
│   │   │   ├── test/
│   │   │   │   ├── login.data.json          # 4 login test cases (test)
│   │   │   │   ├── cart.data.json
│   │   │   │   └── e2e.data.json
│   │   │   ├── staging/
│   │   │   │   ├── login.data.json
│   │   │   │   ├── cart.data.json
│   │   │   │   └── e2e.data.json
│   │   │   └── prod/
│   │   │       ├── login.data.json
│   │   │       ├── cart.data.json
│   │   │       └── e2e.data.json
│   │   ├── pages/                           # Page objects (ClientBasePage, LoginPage, etc.)
│   │   ├── Test/                            # Clean, minimal test specs
│   │   │   ├── login.spec.ts                # 4 data-driven login tests + if conditions
│   │   │   ├── addToCart.spec.ts            # 2 cart tests (positive/negative)
│   │   │   └── e2eValidFlow.spec.ts         # End-to-end registration to order flow
│   │   ├── utils/
│   │   │   └── TestData.ts                  # Type definitions only (optional reference)
│   │   └── screenshots/                     # Auto-generated test screenshots (cleaned each run)
│   │       ├── TC01 valid login with registered credentials [chromium].png
│   │       ├── TC02 invalid login with valid email but wrong password [chromium].png
│   │       ├── TC03 invalid login with unregistered email [chromium].png
│   │       ├── TC04 invalid login with empty email and password [chromium].png
│   │       ├── TC05 add valid product to cart (positive) [chromium].png
│   │       ├── TC06 verify invalid product is not available in cart (negative) [chromium].png
│   │       └── E2E complete valid flow from registration to order confirmation [test] [chromium].png
│   │
│   ├── SauceDemo/                           # SauceDemo login flow (Multi-Environment)
│   │   ├── pages/
│   │   │   ├── SauceDemoBasePage.ts         # Suite-specific convenience methods
│   │   │   └── LoginPage.ts                 # Extends SauceDemoBasePage
│   │   ├── config/
│   │   │   └── env.config.json              # Environment URLs (dev/test/staging/prod)
│   │   ├── data/                            # Per-environment JSON test data
│   │   │   ├── dev/
│   │   │   │   └── login.data.json
│   │   │   ├── test/
│   │   │   │   └── login.data.json
│   │   │   ├── staging/
│   │   │   │   └── login.data.json
│   │   │   └── prod/
│   │   │       └── login.data.json
│   │   ├── Test/
│   │   │   └── login.spec.ts                # Data-driven login test
│   │   └── screenshots/                     # Auto-generated test screenshots
│   │       └── SauceDemo - Login [test] verifies... [chromium].png
│   │
│   └── SpecialLocators/                     # Locator strategy practice
│       └── SpecialLocators.spec.ts          # Form filling & shopping flow
│
├── Typescript_Fundamentals/                 # TypeScript language practice (untouched)
│   ├── arrays.spec.ts
│   ├── classes.spec.ts
│   ├── functions.ts
│   ├── promises.ts
│   └── ... (17 files total)
│
playwright.config.ts                        # Playwright configuration + Allure reporter setup
tsconfig.json                               # TypeScript configuration
package.json                                # Dependencies: @playwright/test, allure-playwright, @faker-js/faker
```

**Key Architecture Points:**
- All test suites import custom test fixture from `tests/core/fixtures.ts` (not directly from `@playwright/test`)
- Automatic failure screenshot + log attachment via the custom fixture
- Suite-specific concerns handled in intermediate base classes (`ClientBasePage`, `SauceDemoBasePage`)
- All suites inherit core `BasePage` functionality (navigation, element interactions, logging)

## Prerequisites

- [Node.js](https://nodejs.org/) installed

## Setup

Install dependencies:

```bash
npm install
```

Install Playwright browsers (first time only):

```bash
npx playwright install
```

## Running Tests

### Quick Start

Run all tests with **Allure** reporting, automatic failure capture, and global cleanup:

```bash
npm test
```

This will:
- Clean up old test results (allure-results, test-results, playwright-report) via `globalSetup.ts`
- Run all tests in headless mode (Chromium, Firefox, WebKit)
- Capture screenshots on failure (in-memory, no disk artifacts)
- Buffer logs per test and attach on failure
- Generate Allure, HTML, JUnit reports

### Run Options

**Headless (default — all browsers):**
```bash
npm test
```

**With browser visible:**
```bash
npm run test:headed
```

**Single browser (e.g., Chromium only):**
```bash
npx playwright test --project=chromium
```

**Run a specific suite:**
```bash
npx playwright test tests/suites/TestAutomationPractice --project=chromium
npx playwright test tests/suites/RahulShettyClient --project=chromium
npx playwright test tests/suites/SauceDemo --project=chromium
```

**Run a specific test file:**
```bash
npx playwright test tests/suites/RahulShettyClient/Test/registerLoginCheckout.spec.ts
```

**Run with traces enabled (debug):**
```bash
npx playwright test --trace=on
```

### Multi-Environment Testing (All Suites)

All three test suites (**RahulShettyClient**, **TestAutomationPractice**, **SauceDemo**) support testing against **4 environments: dev, test, staging, and prod** with separate URLs and test data per environment.

**Run tests for a specific environment:**

```bash
npm run test:dev      # Run against dev environment
npm run test:test     # Run against test environment (default)
npm run test:staging  # Run against staging environment
npm run test:prod     # Run against prod environment (E2E test skipped)
```

**How it works:**

1. **Environment Selector** (`tests/core/env.ts`)
   - Reads `TEST_ENV` environment variable (default: `test`)
   - Validates against: `dev`, `test`, `staging`, `prod`
   - Throws clear error if invalid value is passed

2. **Environment Configuration** (per-suite `config/env.config.json`)
   
   Each suite has its own config file:
   ```
   tests/suites/RahulShettyClient/config/env.config.json
   tests/suites/TestAutomationPractice/config/env.config.json
   tests/suites/SauceDemo/config/env.config.json
   ```
   
   Example structure:
   ```json
   {
     "dev": { "baseUrl": "https://dev.example.com/" },
     "test": { "baseUrl": "https://test.example.com/" },
     "staging": { "baseUrl": "https://staging.example.com/" },
     "prod": { "baseUrl": "https://prod.example.com/" }
   }
   ```
   Change URLs here per environment. Currently all environments point to the same site.

3. **Per-Environment Test Data** (per-suite `data/` folder)
   Each suite has its own data folder structure. Example for RahulShettyClient:
   ```
   tests/suites/RahulShettyClient/data/
   ├── dev/
   │   ├── login.data.json
   │   ├── cart.data.json
   │   └── e2e.data.json
   ├── test/
   │   ├── login.data.json
   │   ├── cart.data.json
   │   └── e2e.data.json
   ├── staging/
   │   ├── login.data.json
   │   ├── cart.data.json
   │   └── e2e.data.json
   └── prod/
       ├── login.data.json
       ├── cart.data.json
       └── e2e.data.json
   ```
   
   Similarly, TestAutomationPractice and SauceDemo have their own per-env data folders:
   ```
   tests/suites/TestAutomationPractice/data/{dev,test,staging,prod}/alerts.data.json
   tests/suites/SauceDemo/data/{dev,test,staging,prod}/login.data.json
   ```
   
   Each environment has its own test data folder. Update credentials per env.

4. **Test Titles Show Environment**
   
   All test suites include the environment in their titles, making it clear which environment ran:
   - RahulShettyClient: `RahulShettyClient - Login [dev]`, `RahulShettyClient - Add to Cart [staging]`
   - TestAutomationPractice: `Alerts Handling [test]`
   - SauceDemo: `SauceDemo - Login [prod]: verifies that...`
   
   Visible in test reports and console output.

5. **Prod Safety Guard (RahulShettyClient Only)**
   - E2E test is **automatically skipped on prod**
   - Login and cart tests still run (read-only operations)
   - Prevents accidental user registration and orders on production

**Advanced: Using TEST_ENV directly**

```bash
# Via cross-env (works on Windows)
npm run test:dev

# Via PowerShell environment variable
$env:TEST_ENV='staging'; npx playwright test tests/suites/RahulShettyClient

# Via bash (Unix)
TEST_ENV=staging npx playwright test tests/suites/RahulShettyClient
```

**Screenshots**

All test screenshots are automatically saved per suite:
```
tests/suites/RahulShettyClient/screenshots/
├── TC01 valid login with registered credentials [chromium].png
├── TC02 invalid login with valid email but wrong password [chromium].png
├── TC03 invalid login with unregistered email [chromium].png
├── TC04 invalid login with empty email and password [chromium].png
├── TC05 add valid product to cart (positive) [chromium].png
├── TC06 verify invalid product is not available in cart (negative) [chromium].png
└── E2E complete valid flow from registration to order confirmation [test] [chromium].png

tests/suites/TestAutomationPractice/screenshots/
├── Test 1 Handle Simple Alert [chromium].png
├── Test 2 Handle Confirmation Alert [chromium].png
└── Test 3 Handle Prompt Alert with Input [chromium].png

tests/suites/SauceDemo/screenshots/
└── SauceDemo - Login [test] verifies that the default user logged... [chromium].png
```

Screenshots are captured for all tests (pass and fail) and attached to Allure and HTML reports. Screenshots folders are automatically cleaned before each test run and regenerated during test execution.

**Adding a new environment:**

1. Add entry to `env.config.json`:
   ```json
   "qa": { "baseUrl": "https://qa.example.com/client/#" }
   ```

2. Create data folder: `data/qa/` with `login.data.json`, `cart.data.json`, `e2e.data.json`

3. Add npm script to `package.json`:
   ```json
   "test:qa": "cross-env TEST_ENV=qa playwright test tests/suites/RahulShettyClient"
   ```

4. Run: `npm run test:qa`

### Viewing Reports

**Allure Report** (rich with screenshots, logs, metadata):
```bash
npm run allure:generate
npm run allure:open
```

Or combine in one command:
```bash
npm run test:report:allure
```

**Playwright HTML Report:**
```bash
npm run test:report
```

**Trace Viewer** (for specific test failures):
```bash
npx playwright show-trace "test-results/[test-folder]/trace.zip"
```

## CI/CD Pipeline (GitHub Actions)

The project includes GitHub Actions workflow (`.github/workflows/playwright.yml`) that automatically runs tests on:
- **Push** to `main` or `Task*` branches (uses `test` environment by default)
- **Pull requests** to `main` (uses `test` environment)
- **Manual trigger** (workflow_dispatch) — choose environment from dropdown

### Running in Pipeline

**Automatic (push/PR):**
```yaml
# Automatically uses TEST_ENV=test
# Runs: npx playwright test tests/suites/RahulShettyClient
```

**Manual trigger (GitHub Actions UI):**
1. Go to `.github/workflows/playwright.yml`
2. Click "Run workflow"
3. Select environment: `dev`, `test`, `staging`, or `prod`
4. Click "Run workflow"

**What pipeline does:**
- ✅ Installs dependencies (`npm ci`)
- ✅ Installs Playwright browsers
- ✅ Runs RahulShettyClient tests for the selected environment
- ✅ Generates Playwright HTML report
- ✅ Generates Allure report with screenshots
- ✅ Uploads artifacts with environment name (test-results-dev, test-results-test, etc.)
- ✅ Creates comment on PRs with test results summary

**Artifacts uploaded per run:**
```
test-screenshots-{env}/          # 7 test screenshots
playwright-report-{env}/         # HTML report
allure-report-{env}/             # Rich Allure report
allure-results-{env}/            # Trend analysis data
test-results-{env}/              # JUnit XML & JSON
```

### Environment-Specific Behavior

| Environment | E2E Test | Use Case |
|-------------|----------|----------|
| **dev** | ✅ Runs | Development testing |
| **test** | ✅ Runs | Default CI/CD environment |
| **staging** | ✅ Runs | Pre-production validation |
| **prod** | ⏭️ Skipped | Production read-only tests (no registration) |

## Test Suites

### 1. TestAutomationPractice — Alerts Handling (Multi-Environment)

**Flow:** Tests browser alert dialogs (simple alert, confirmation, prompt)  
**URL:** https://testautomationpractice.blogspot.com/  
**Tests:** 3 scenarios (handle simple alert, confirmation, prompt with input)  
**Environments:** Supports dev, test, staging, prod with per-env data (`alerts.data.json`)  
**Features:**
- Self-healing locators with backup strategies
- Dialog handling (accept/dismiss/input)
- Automatic failure screenshot + log capture via fixture
- Multi-environment URL and test data support
- Test title includes environment: `Alerts Handling [dev]`, `Alerts Handling [prod]`

**Running with environments:**
```bash
npm run test:dev -- tests/suites/TestAutomationPractice    # Run against dev
npm run test:test -- tests/suites/TestAutomationPractice   # Run against test
npm run test:staging -- tests/suites/TestAutomationPractice # Run against staging
npm run test:prod -- tests/suites/TestAutomationPractice    # Run against prod
```

### 2. RahulShettyClient — E-Commerce Flow (JSON Data-Driven)

**Flow:** Register → Login → Add to Cart → Checkout  
**URL:** https://rahulshettyacademy.com/client/  
**Tests:** 7 tests across 3 specs (4 login + 2 cart + 1 E2E), all data from JSON files  
**Features:**
- ✅ **JSON Data-Driven:** All test data read from `data/*.json` files via `fs.readFileSync()`
- ✅ **Clean Specs:** Direct JSON reading + inline `if` conditions for assertions (no helper functions)
- ✅ **ISTQB FL Test Design:** 4 login tests covering positive, equivalence partitioning, and boundary testing
- ✅ **Automatic Screenshots:** 7 screenshots captured (one per test) saved to `screenshots/` folder
- ✅ **Core Fixture Integration:** Uses `autoScreenshot` fixture from `tests/core/fixtures.ts`
- ✅ **Structured Logging:** `logger.step()` for each test stage + automatic Allure attachment on failure
- ✅ **Dynamic E2E:** `{{timestamp}}` placeholder in email for unique registrations on each run

**Test Cases:**

| Test ID | Description | Technique | Data Source |
|---------|-------------|-----------|------------|
| TC01 | Valid login with registered credentials | Positive | login.data.json |
| TC02 | Invalid login (valid email, wrong password) | Equivalence Partitioning | login.data.json |
| TC03 | Invalid login (unregistered email) | Equivalence Partitioning | login.data.json |
| TC04 | Invalid login (empty email & password) | Boundary Testing | login.data.json |
| TC05 | Add valid product to cart (positive) | Positive | cart.data.json |
| TC06 | Verify invalid product unavailable (negative) | Negative | cart.data.json |
| E2E | Register → Login → Add to Cart → Checkout | End-to-End | e2e.data.json |

**JSON Files:**
- `login.data.json` — 4 test cases with expected outcomes (dashboard redirect, error toasts, field errors)
- `cart.data.json` — Valid/invalid product names, login credentials
- `e2e.data.json` — User data, product name, checkout details (card, country, etc.) with `{{timestamp}}` email placeholder

### 3. SauceDemo — Login Verification (Multi-Environment)

**Flow:** Login → Verify inventory page redirect  
**URL:** https://www.saucedemo.com/  
**Tests:** 1 scenario (standard user login)  
**Environments:** Supports dev, test, staging, prod with per-env data (`login.data.json`)  
**Credentials:** `standard_user` / `secret_sauce` (from `data/{env}/login.data.json`)  
**Features:**
- Suite-specific `SauceDemoBasePage` with `open()` convenience method
- Simple, fast test for login flow validation
- Multi-environment URL and test data support
- Test title includes environment: `SauceDemo - Login [dev]`, `SauceDemo - Login [prod]`

**Running with environments:**
```bash
npm run test:dev -- tests/suites/SauceDemo    # Run against dev
npm run test:test -- tests/suites/SauceDemo   # Run against test
npm run test:staging -- tests/suites/SauceDemo # Run against staging
npm run test:prod -- tests/suites/SauceDemo    # Run against prod
```

### 4. SpecialLocators — Locator Strategy Practice

**Flow:** Form filling → Shopping flow  
**URL:** https://rahulshettyacademy.com/angularpractice/  
**Tests:** 1 scenario (form fill + add to cart)  
**Features:**
- Advanced Playwright locators: `getByRole`, `getByLabel`, `.filter()`, chaining
- No page objects (inline locators for learning purposes)
- Automatic failure screenshot + log capture

## Core Libraries & Features

### 📸 Automatic Failure Capture

The custom fixture (`tests/core/fixtures.ts`) automatically captures on test failure:
- **Screenshot**: Full-page PNG taken in-memory (no disk files)
- **Logs**: All buffered logger entries (INFO, STEP, ERROR with timestamps)

Both are attached to Allure reports under the failed test. No manual screenshot calls needed.

```typescript
// Example: logs automatically captured on failure
async ({ page, logger }) => {
  logger.step('Navigating to login page');    // ← Logged
  logger.step('Entering credentials');        // ← Logged
  await loginPage.login(email, password);    // ← If this fails, screenshot + logs attached
}
```

### 📋 Custom Logger

Lightweight per-test logger with automatic Allure attachment:

```typescript
// Available methods
logger.info('Informational message');
logger.step('Test step message');
logger.error('Error message');

// All logged with ISO timestamps
// [2026-09-26T11:02:30.123Z] STEP: Test step message
```

### 🔄 Self-Healing Locators

`SelfHealingLocator` utility provides fallback strategies for flaky elements:

```typescript
// Primary locator + backup strategies
await this.healingLocator.clickWithHealing(
  this.page.getByRole('button', { name: 'Add' }),  // Primary
  [
    this.page.locator('#add-btn'),                  // Backup 1
    this.page.locator('button[onclick="addItem()"]') // Backup 2
  ]
);
```

### 🧹 Global Setup & Cleanup

`globalSetup.ts` runs before each test session to:
- Delete `allure-results/` — removes old Allure reports
- Delete `test-results/` — removes old Playwright reports
- Delete `playwright-report/` — removes old HTML reports

Ensures clean result state on every run (no stale artifacts accumulate).

### 🔌 Custom Test Fixture

All specs import from `tests/core/fixtures.ts` instead of `@playwright/test`:

```typescript
// CORRECT: import from core
import { test, expect } from '../../../core/fixtures';

// NOT from @playwright/test directly
// The custom fixture adds: logger injection + auto-failure capture
```

Use the logger fixture in your tests:

```typescript
test('example', async ({ page, logger }) => {
  logger.step('Starting test');
  // ... test code ...
  // On failure: screenshot + logs automatically attached to Allure
});
```

## Configuration

### Timeouts

The following timeouts in `playwright.config.ts` support testing against external sites with variable network latency:

- **`timeout: 60000`** — Overall test timeout (60 seconds)
- **`navigationTimeout: 60000`** — Navigation timeout for `page.goto()` (60 seconds)
- **`actionTimeout: 60000`** — Timeout for element interactions like fill, click (60 seconds)
- **`waitUntil: 'domcontentloaded'`** — Navigation waits for DOM ready instead of full page load (faster for external sites)

### Reporters

Configured reporters in `playwright.config.ts`:
- **`allure-playwright`** — Rich report with screenshots, logs, and metadata
- **`html`** — Built-in Playwright HTML report with timeline
- **`json`** — Machine-readable test results
- **`junit`** — JUnit XML for CI/CD integration
- **`list`** — Console output

### Tracing

Traces are always enabled (`trace: 'on'`) to capture:
- Network requests
- DOM snapshots at each step
- Detailed timeline of all actions

View traces with:
```bash
npx playwright show-trace "test-results/[test-folder]/trace.zip"
```

## Creating New Test Suites

Follow this pattern when adding a new test suite:

1. **Create suite folder:**
   ```
   tests/suites/MyNewSuite/
   ├── pages/
   ├── Test/
   └── utils/
   ```

2. **Extend core BasePage** (or create suite-specific base if needed):
   ```typescript
   // tests/suites/MyNewSuite/pages/MyBasePage.ts
   import { BasePage } from '../../../core/BasePage';
   import { Logger } from '../../../core/Logger';

   export class MyBasePage extends BasePage {
     constructor(page: Page, logger: Logger) {
       super(page, logger);
     }
     // Add suite-specific helpers
   }
   ```

3. **Use custom test fixture** in specs:
   ```typescript
   // tests/suites/MyNewSuite/Test/myTest.spec.ts
   import { test, expect } from '../../../core/fixtures';
   import { MyPage } from '../pages/MyPage';

   test('example', async ({ page, logger }) => {
     const myPage = new MyPage(page, logger);
     logger.step('Starting test');
     // ... test code ...
   });
   ```

4. **Automatic failure capture** works out of the box — no extra configuration needed.

## JSON Data-Driven Testing (RahulShettyClient Suite)

The RahulShettyClient suite demonstrates a **pure JSON data-driven approach** with clean, minimal test specs:

### How It Works

**1. Data Files (JSON Only)**
```json
// data/login.data.json
[
  {
    "id": "TC01",
    "title": "valid login with registered credentials",
    "technique": "Positive - Valid Credentials",
    "email": "autotest.tc01.1790632625083@gmail.com",
    "password": "AutoTest@1790632625083",
    "expected": {
      "type": "dashboard",
      "message": "User is redirected to dashboard"
    }
  },
  {
    "id": "TC02",
    "title": "invalid login with valid email but wrong password",
    "technique": "Equivalence Partitioning - Invalid Password",
    "email": "autotest.tc01.1790632625083@gmail.com",
    "password": "WrongPassword@123",
    "expected": {
      "type": "toast",
      "message": "Incorrect email or password."
    }
  }
  // ... 2 more test cases
]
```

**2. Test Specs (Direct JSON Reading + If Conditions)**
```typescript
// Test/login.spec.ts
import * as fs from 'fs';
import * as path from 'path';

const loginDataPath = path.resolve(__dirname, '../data/login.data.json');
const loginCases = JSON.parse(fs.readFileSync(loginDataPath, 'utf-8'));

test.describe('RahulShettyClient - Login (Data-Driven from JSON)', () => {
  for (const testCase of loginCases) {
    test(`${testCase.id}: ${testCase.title}`, async ({ page, logger, autoScreenshot }) => {
      await test.step(`${testCase.id}: Navigate to login page`, async () => {
        await loginPage.goto();
      });

      await test.step(`${testCase.id}: Enter credentials`, async () => {
        await loginPage.login(testCase.email, testCase.password);
      });

      await test.step(`${testCase.id}: Verify expected outcome`, async () => {
        // Direct if conditions — no helper functions
        if (testCase.expected.type === 'dashboard') {
          await expect(page).toHaveURL(/dashboard/);
        } else if (testCase.expected.type === 'toast') {
          const errorToast = page.getByText(testCase.expected.message, { exact: false });
          await expect(errorToast).toBeVisible({ timeout: 5000 });
        } else if (testCase.expected.type === 'fieldError') {
          const fieldError = page.getByText(testCase.expected.message, { exact: false });
          await expect(fieldError).toBeVisible({ timeout: 5000 });
        }
      });
    });
  }
});
```

**3. Dynamic Timestamps (E2E Tests)**

The E2E test uses `{{timestamp}}` placeholder in the email to ensure unique registrations on each run:

```json
// data/e2e.data.json
{
  "user": {
    "email": "e2e.user.{{timestamp}}@gmail.com",
    "password": "E2ETest@Rahul123"
    // ...
  }
}
```

**In the spec**, the placeholder is replaced:
```typescript
let e2eDataRaw = fs.readFileSync(e2eDataPath, 'utf-8');
e2eDataRaw = e2eDataRaw.replace(/\{\{timestamp\}\}/g, Date.now().toString());
const e2eData = JSON.parse(e2eDataRaw);
```

### Benefits

✅ **Separation of Concerns:** Data in JSON, logic in specs  
✅ **Easy Maintenance:** Add test cases = add JSON rows (no code changes)  
✅ **ISTQB Compliant:** Test design techniques documented in JSON (`technique` field)  
✅ **Clean Code:** Minimal specs with direct logic (no helper abstractions)  
✅ **Reusable Screenshots:** Automatic `autoScreenshot` fixture captures all test results  

### Running RahulShettyClient Tests

```bash
# Run all 7 tests
npx playwright test tests/suites/RahulShettyClient/Test/ --project=chromium --workers=1

# Run specific spec
npx playwright test tests/suites/RahulShettyClient/Test/login.spec.ts --project=chromium

# Run in headed mode (see browser)
npx playwright test tests/suites/RahulShettyClient/Test/ --project=chromium --headed --workers=1
```

**Expected Results:**
- 7 tests pass (4 login + 2 cart + 1 E2E)
- 7 screenshots auto-captured to `tests/suites/RahulShettyClient/screenshots/`
- Allure report includes all screenshots + logs

## Troubleshooting

**Tests timing out?**
- Increase `timeout`, `navigationTimeout`, or `actionTimeout` in `playwright.config.ts`
- Use `--trace=on` flag to capture trace for debugging

**Flaky selectors?**
- Use `SelfHealingLocator` with backup strategies (see example above)
- Check `tests/core/SelfHealingLocator.ts` for available methods

**Allure report not showing?**
- Run `npm run allure:generate` to build the report
- Run `npm run allure:open` to open in browser

**Screenshots not appearing in reports?**
- Verify test is failing (screenshots only captured on failure)
- Check `allure-results/` directory has `attachment.zip` files with PNG inside
