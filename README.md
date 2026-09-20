# Playwright Practice

End-to-end test suites built with Playwright and TypeScript, using the Page Object Model pattern. The repo currently holds two independent scenarios.
It contains standalone specs against different public practice sites, used to try out locators, page object structure, and Playwright APIs.

## Project Structure

```text
tests/
├── E2E Senario for rahulshettyacademy_client/   # Register → Login → Add to Cart → Checkout flow
│   ├── data/
│   │   └── TestData.ts                          # Faker-based user/checkout data factories
│   ├── pages/
│   │   ├── BasePage.ts                          # Shared navigation, actions, screenshots
│   │   ├── RegisterPage.ts
│   │   ├── LoginPage.ts
│   │   ├── AddToCartPage.ts
│   │   └── CheckoutPage.ts
│   ├── screenshots/                             # Screenshots captured during the run
│   └── Test/
│       └── registerLoginCheckout.spec.ts
├── LoaginSenario for sauceDemo/                 # SauceDemo login flow
│   ├── pages/
│   │   ├── BasePage_saucedemo.ts
│   │   └── loginPage_saucedemo.ts
│   └── test/
│       └── LoginPageTest_saucedemo.spec.ts
└── SpecialLocators.spec.ts                      # Locator practice against rahulshettyacademy.com/angularpractice

playwright.config.ts                             # Playwright configuration (chromium, firefox, webkit)
tsconfig.json                                    # TypeScript configuration
```

Specs are independent of each other — each targets its own practice site and can be run on its own.

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

Run all tests (headless, across Chromium, Firefox, and WebKit):

```bash
npm test
```

Run tests in headed mode:

```bash
npm run test:headed
```

Run a specific scenario:

```bash
npx playwright test "tests/E2E Senario for rahulshettyacademy_client/Test/registerLoginCheckout.spec.ts"
npx playwright test "tests/LoaginSenario for sauceDemo/test/LoginPageTest_saucedemo.spec.ts"
```

Run a specific test with trace enabled:

```bash
npx playwright test registerLoginCheckout.spec.ts --project=chromium --trace=on
```

View the HTML report and trace after a run:

```bash
npm run test:report
```

Or view the trace directly:

```bash
npx playwright show-report
npx playwright show-trace "test-results/[test-name]/trace.zip"
```

## Scenarios

### rahulshettyacademy.com/client — Register, Login, Add to Cart, Checkout

Registers a new random user (via `@faker-js/faker`), logs in with those credentials, adds "ZARA COAT 3" to the cart, and completes checkout with randomized payment/shipping data. Screenshots are captured at key steps into `tests/E2E Senario for rahulshettyacademy_client/screenshots/`.

Note: several inputs on this site have accessibility quirks (labels not correctly associated to their inputs, accessible names driven by `placeholder` rather than a semantic label). The page objects use `id`/CSS locators instead of `getByLabel`/`getByRole` where those are more reliable.

### SauceDemo login

Logs in with the standard SauceDemo test account (`standard_user` / `secret_sauce`) and verifies redirection to the inventory page.

## Configuration

### Timeouts

The following timeouts are configured in `playwright.config.ts` to support testing against external sites with variable network latency:

- **`timeout: 60000`** — Overall test timeout (60 seconds)
- **`navigationTimeout: 60000`** — Navigation timeout for `page.goto()` (60 seconds)
- **`actionTimeout: 60000`** — Timeout for element interactions like fill, click, etc. (60 seconds)
- **`waitUntil: 'domcontentloaded'`** — Navigation waits for DOM to be ready instead of all resources to load (faster for external sites)

These settings prevent timeout failures on slow or network-dependent external websites.

### Tracing

Traces are configured to capture on the first retry (`trace: 'on-first-retry'`). To capture traces on every run, use the `--trace=on` flag with the test command. Traces are invaluable for debugging test failures—they capture network requests, DOM snapshots, and a detailed timeline of actions.

## Notes

- **SauceDemo tests** (`tests/LoaginSenario for sauceDemo/test/LoginPageTest_saucedemo.spec.ts`) use the Page Object Model pattern and log in with the standard SauceDemo test account (`standard_user` / `secret_sauce`).
- **SpecialLocators.spec.ts** practices Playwright locator strategies (`getByRole`, `getByLabel`, `getByPlaceholder`, `.filter()`, chaining) against a form/shop demo site.
- Some specs use `slowMo` for easier visual debugging; adjust or remove this in the spec file for faster runs.
- `tests/**/*.ts` is included wholesale in `tsconfig.json`, so any new scenario folder under `tests/` is type-checked automatically.
