# Commands

## Package Scripts
```bash
npm run test:dev         # TEST_ENV=dev
npm run test:test        # TEST_ENV=test (default)
npm run test:staging
npm run test:prod

npm test                 # All projects (chromium, firefox, webkit)
npm run test:headed      # Headed mode
npm run test:report      # Show HTML report
npm run allure:generate
npm run allure:open
```

## Playwright CLI
```bash
npx playwright test tests/suites/RahulShettyClient/Test/login.spec.ts
npx playwright test --project=chromium
npx playwright test -g "TC01"                         # Match title
npx playwright test --ui                             # Interactive
npx playwright test --debug                          # Debugger
npx playwright test --list                           # Discover
npx playwright show-report                           # HTML results
npx playwright show-trace test-results/.../trace.zip
npx playwright codegen https://rahulshettyacademy.com/client
npx tsc --noEmit                                     # Type check
```

## Environment
PowerShell: `$env:TEST_ENV='staging'; npx playwright test ...`  
Bash: `TEST_ENV=staging npx playwright test ...`
