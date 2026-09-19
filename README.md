# Playwright Practice

A personal sandbox for practicing end-to-end testing with [Playwright](https://playwright.dev/) and TypeScript. It contains standalone specs against different public practice sites, used to try out locators, page object structure, and Playwright APIs.

## Project Structure

```
tests/
├── BasePage_saucedemo.ts           # Base page object with shared URL/navigation logic
├── loginPage_saucedemo.ts          # SauceDemo login page object (locators + actions)
├── LoginPageTest_saucedemo.spec.ts # SauceDemo login test spec (Page Object Model)
└── SpecialLocators.spec.ts         # Locator practice against rahulshettyacademy.com/angularpractice
playwright.config.ts                # Playwright configuration
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
npx playwright test
```

Run tests in headed mode:

```bash
npx playwright test --headed
```

Run a specific test file:

```bash
npx playwright test tests/LoginPageTest_saucedemo.spec.ts
```

Open the HTML report after a run:

```bash
npx playwright show-report
```

## Notes

- **SauceDemo tests** (`LoginPageTest_saucedemo.spec.ts`) use the Page Object Model pattern. Test users and credentials are defined in `LoginPage.users()` (`tests/loginPage_saucedemo.ts`), based on the standard SauceDemo test accounts (`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`), all using password `secret_sauce`.
- **SpecialLocators.spec.ts** practices Playwright locator strategies (`getByRole`, `getByLabel`, `getByPlaceholder`, `.filter()`, chaining) against a form/shop demo site.
- Some specs use `slowMo` for easier visual debugging; adjust or remove this in the spec file for faster runs.
