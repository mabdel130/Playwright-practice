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
│   ├── TestAutomationPractice/              # Alerts handling flow
│   │   ├── pages/
│   │   │   └── AlertsPage.ts                # Extends core BasePage
│   │   ├── Test/
│   │   │   └── alertsHandling.spec.ts
│   │   └── utils/
│   │       └── TestData.ts                  # Suite-specific alert test data
│   │
│   ├── RahulShettyClient/                   # Register → Login → Add to Cart → Checkout flow
│   │   ├── pages/
│   │   │   ├── ClientBasePage.ts            # Suite-specific base (gotoRoute, toastMessage)
│   │   │   ├── RegisterPage.ts              # Extends ClientBasePage
│   │   │   ├── LoginPage.ts
│   │   │   ├── AddToCartPage.ts
│   │   │   └── CheckoutPage.ts
│   │   ├── Test/
│   │   │   └── registerLoginCheckout.spec.ts
│   │   └── utils/
│   │       └── TestData.ts                  # Faker-based user/checkout data factories
│   │
│   ├── SauceDemo/                           # SauceDemo login flow
│   │   ├── pages/
│   │   │   ├── SauceDemoBasePage.ts         # Suite-specific convenience methods
│   │   │   └── LoginPage.ts                 # Extends SauceDemoBasePage
│   │   └── Test/
│   │       └── login.spec.ts
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

## Test Suites

### 1. TestAutomationPractice — Alerts Handling

**Flow:** Tests browser alert dialogs (simple alert, confirmation, prompt)  
**URL:** https://testautomationpractice.blogspot.com/  
**Tests:** 3 scenarios (handle simple alert, confirmation, prompt with input)  
**Features:**
- Self-healing locators with backup strategies
- Dialog handling (accept/dismiss/input)
- Automatic failure screenshot + log capture via fixture

### 2. RahulShettyClient — E-Commerce Flow

**Flow:** Register new user → Login → Add to Cart → Checkout  
**URL:** https://rahulshettyacademy.com/client/  
**Tests:** Full workflow with randomized user data and payment details  
**Features:**
- Faker-based test data generation (`createUser()`, `createCheckoutData()`)
- Suite-specific `ClientBasePage` with `gotoRoute()` navigation pattern
- Self-healing locators for dynamic elements (country autocomplete)
- Structured logging via `logger.step()` for each test stage
- Automatic failure capture (screenshot + logs attached to Allure)

**Test Data:** Generated via `@faker-js/faker` — each run creates unique:
- User: first/last name, email, phone, occupation, gender, password
- Checkout: credit card, expiry, CVV, shipping name, random country

### 3. SauceDemo — Login Verification

**Flow:** Login → Verify inventory page redirect  
**URL:** https://www.saucedemo.com/  
**Tests:** 1 scenario (standard user login)  
**Credentials:** `standard_user` / `secret_sauce` (SauceDemo test account)  
**Features:**
- Suite-specific `SauceDemoBasePage` with `open()` convenience method
- Simple, fast test for login flow validation

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
