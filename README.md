# Swag Labs (SauceDemo) - Playwright Tests

End-to-end tests for [saucedemo.com](https://www.saucedemo.com/) built with Playwright and TypeScript, using the Page Object Model pattern.

## Project Structure

```
tests/
├── BasePage_saucedemo.ts        # Base page object with shared URL/navigation logic
├── loginPage_saucedemo.ts       # Login page object (locators + actions)
└── LoginPageTest_saucedemo.spec.ts  # Login test spec
playwright.config.ts             # Playwright configuration
```

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

- Login test users and credentials are defined in `LoginPage.users()` (`tests/loginPage_saucedemo.ts`), based on the standard SauceDemo test accounts (`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`), all using password `secret_sauce`.
- Tests run with `slowMo: 800` for easier visual debugging; adjust or remove this in the spec file for faster runs.
