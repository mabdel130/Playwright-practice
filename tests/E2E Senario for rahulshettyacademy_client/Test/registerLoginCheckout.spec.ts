import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { AddToCartPage } from '../pages/AddToCartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { createUser, createCheckoutData, PRODUCT_NAME } from '../data/TestData';

test.describe('rahulshettyacademy.com/client — Register, Login, Add to Cart, Checkout', () => {
  test('registers, logs in, adds Zara Coat to cart and completes checkout', async ({ page }) => {
    const user = createUser();
    const checkoutData = createCheckoutData(user);

    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const addToCartPage = new AddToCartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await test.step('Register a new user', async () => {
      await registerPage.goto();
      await registerPage.registerUser(user);
      await expect(registerPage.successToast).toBeVisible();
    });

    await test.step('Log in with the same email and password', async () => {
      await loginPage.goto();
      await loginPage.login(user.email, user.password);
      await expect(page).toHaveURL(/dashboard/);
      await loginPage.takeScreenshot('after-login');
    });

    await test.step('Add ZARA COAT 3 to the cart and verify the count increases by one', async () => {
      await addToCartPage.goto();
      await addToCartPage.addProductAndVerifyCartIncreasedByOne(PRODUCT_NAME);
      await addToCartPage.takeScreenshot('after-add-to-cart');
    });

    await test.step('Go to cart and proceed to Checkout', async () => {
      await addToCartPage.goToCart();
      await expect(addToCartPage.cartItemRow(PRODUCT_NAME)).toBeVisible();
      await addToCartPage.proceedToCheckout();
    });

    await test.step('Fill payment, shipping name and Country, then place the order', async () => {
      await checkoutPage.fillPaymentDetails(checkoutData);
      await checkoutPage.fillShippingName(`${user.firstName} ${user.lastName}`);
      await checkoutPage.selectCountry(checkoutData.country);
      await expect(checkoutPage.countryInput).toHaveValue(checkoutData.country);

      await checkoutPage.takeScreenshot('after-filling-checkout-info');

      await checkoutPage.clickPlaceOrder();
    });

    await test.step('Verify the order was placed successfully', async () => {
      await expect(checkoutPage.orderConfirmationMessage).toBeVisible();
      await checkoutPage.takeScreenshot('after-order-confirmation');
    });
  });
});
