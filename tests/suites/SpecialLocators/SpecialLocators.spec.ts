import { test, expect, practiceData } from './fixtures';

test('Fill form and submit', async ({ practicePage }) => {
  await practicePage.goto();
  await practicePage.submitForm(practiceData.form);
  await expect(practicePage.getSuccessAlert()).toContainText('Success!');

  await practicePage.openShop();
  for (const product of practiceData.products) {
    await practicePage.addProduct(product);
  }
  await expect(practicePage.getCheckoutButton()).toContainText(`Checkout ( ${practiceData.products.length} )`);
});
