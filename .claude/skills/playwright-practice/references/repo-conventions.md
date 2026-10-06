# Repo Conventions

## Layout
```
tests/core/                BasePage, Logger, fixtures, globalSetup, env, DataLoader
  api/BaseApi.ts           Base for API clients
tests/suites/<Suite>/
  Test/*.spec.ts           Specs (camelCase.spec.ts)
  pages/<Name>Page.ts      Page objects (extends <Suite>BasePage)
  api/<Name>Api.ts         API clients (extends BaseApi)
  config/                  <Suite>Config.ts, env.config.json
  data/<env>/*.json        Per-environment data (dev|test|staging|prod)
  data/TestData.ts         Types + resolveCredentials
  fixtures.ts              Suite fixtures layered on core
```

## Flow
1. `TEST_ENV` selects environment via `core/env.ts` (default: `test`)
2. `loadData(SUITE_DIR, file)` reads `data/<ENV>/<file>`, replaces `{{timestamp}}` with `Date.now()`
3. `loadEnvConfig(suiteDir)` reads `config/env.config.json[ENV]` (baseUrl, apiBaseUrl)
4. `core/fixtures.ts` provides `logger` + `autoScreenshot`; suite fixtures layer on top
5. Data-driven: loop `for (const c of cases)` and `test()` once per case
6. Specs import `{ test, expect }` from `../fixtures`

## Naming
- Suites: PascalCase (RahulShettyClient, SauceDemo)
- Test folder: capital-T `Test/`
- Specs: camelCase.spec.ts
- Pages: PascalCasePage.ts
- Data files: lowercase.data.json
- Titles: `TCxx: description (positive|negative)`

## API Login Pattern
```ts
const token = await authApi.getToken(email, password);  // throws on non-ok
await loginPage.loginWithToken(token);  // init script + reload
```

## Reporting
- Reporters: html, json, junit, list, allure-playwright
- `globalSetup` wipes `allure-results`, `test-results`, `playwright-report`
- Trace: `retain-on-failure`
