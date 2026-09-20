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

Open the HTML report after a run:

```bash
npm run test:report
```

## Scenarios

### rahulshettyacademy.com/client — Register, Login, Add to Cart, Checkout

Registers a new random user (via `@faker-js/faker`), logs in with those credentials, adds "ZARA COAT 3" to the cart, and completes checkout with randomized payment/shipping data. Screenshots are captured at key steps into `tests/E2E Senario for rahulshettyacademy_client/screenshots/`.

Note: several inputs on this site have accessibility quirks (labels not correctly associated to their inputs, accessible names driven by `placeholder` rather than a semantic label). The page objects use `id`/CSS locators instead of `getByLabel`/`getByRole` where those are more reliable.

### SauceDemo login

Logs in with the standard SauceDemo test account (`standard_user` / `secret_sauce`) and verifies redirection to the inventory page.

## Notes

- **SauceDemo tests** (`tests/LoaginSenario for sauceDemo/test/LoginPageTest_saucedemo.spec.ts`) use the Page Object Model pattern and log in with the standard SauceDemo test account (`standard_user` / `secret_sauce`).
- **SpecialLocators.spec.ts** practices Playwright locator strategies (`getByRole`, `getByLabel`, `getByPlaceholder`, `.filter()`, chaining) against a form/shop demo site.
- Some specs use `slowMo` for easier visual debugging; adjust or remove this in the spec file for faster runs.
- `tests/**/*.ts` is included wholesale in `tsconfig.json`, so any new scenario folder under `tests/` is type-checked automatically.
