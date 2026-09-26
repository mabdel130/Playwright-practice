import { test, expect } from '../../core/fixtures';

test.use({ launchOptions: { slowMo: 1100 } });

test('Fill form and submit', async ({ page, logger }) => {
  logger.step('Navigating to Angular practice page');
  await page.goto('https://rahulshettyacademy.com/angularpractice/');

  logger.step('Filling form with user details');
  await page.locator('form input[name="name"]').fill('Ahmed');
  await page.locator('form input[name="email"]').fill('moamed014@gmail.com');
  await page.getByPlaceholder('Password').fill('Test@2456');
  await page.getByRole('checkbox').click();
  await page.locator('select').selectOption('Male');
  await page.getByLabel('Student').click();
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.locator('div.alert.alert-success.alert-dismissible')).toContainText('Success!');

  logger.step('Adding products to cart');
  await page.getByRole('link', { name: 'Shop' }).click();
  await page.locator('app-card').filter({ hasText: 'iphone X' }).getByRole('button', { name: 'Add' }).click();

  await page.locator('app-card').filter({ hasText: 'Blackberry' }).getByRole('button', { name: 'Add' }).click();
  await expect(page.locator('a.nav-link.btn-primary')).toContainText('Checkout ( 2 )');
});
