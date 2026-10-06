# Selector Priority

1. `getByRole('button', { name: 'Login' })` — accessible, resilient
2. `getByLabel('Email')` — form fields with labels
3. `getByPlaceholder('Enter email')` — label-free fields
4. `getByText('Welcome')` — visible text
5. `getByTestId('submit-btn')` — needs `data-testid`
6. CSS/XPath — last resort, third-party widgets only (with comment)

## Scoping with filter() instead of .nth()

```ts
const card = page.locator('.card').filter({ hasText: productName });
await card.getByRole('button', { name: 'Add' }).click();
```

Avoid `.first()` and `.nth()` when order is not the real requirement.

## In this repo

All page objects use appropriate selectors for the third-party Rahul Shetty Academy app:
- ID-based selectors (`#userEmail`, `#userPassword`) for form fields — acceptable because the app lacks semantic labels
- Role-based selectors (`getByRole('button', { name: 'Login' })`) for buttons
- This pattern is documented as correct per skill guidelines
