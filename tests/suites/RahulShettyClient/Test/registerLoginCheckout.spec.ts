import { test, expect } from '../../../core/fixtures';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { AddToCartPage } from '../pages/AddToCartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { createUser, createCheckoutData, PRODUCT_NAME } from '../utils/TestData';

test.describe('rahulshettyacademy.com/client — Register, Login, Add to Cart, Checkout', () => {
  test('registers, logs in, adds Zara Coat to cart and completes checkout', async ({ page, logger }) => {
    const user = createUser();
    const checkoutData = createCheckoutData(user);

    const registerPage = new RegisterPage(page, logger);
    const loginPage = new LoginPage(page, logger);
    const addToCartPage = new AddToCartPage(page, logger);
    const checkoutPage = new CheckoutPage(page, logger);

    await test.step('Register a new user', async () => {
      await registerPage.goto();
      await registerPage.registerUser(user);
      await expect(registerPage.getSuccessToastLocator()).toBeVisible();
    });

    await test.step('Log in with the same email and password', async () => {
      await loginPage.goto();
      await loginPage.login(user.email, user.password);
      await expect(page).toHaveURL(/dashboard/);
    });

    await test.step('Add ZARA COAT 3 to the cart and verify the count increases by one', async () => {
      await addToCartPage.goto();
      await addToCartPage.addProductAndVerifyCartIncreasedByOne(PRODUCT_NAME);
    });

    await test.step('Go to cart and proceed to Checkout', async () => {
      await addToCartPage.goToCart();
      await expect(addToCartPage.getCartItemRowLocator(PRODUCT_NAME)).toBeVisible();
      await addToCartPage.proceedToCheckout();
    });

    await test.step('Fill payment, shipping name and Country, then place the order', async () => {
      await checkoutPage.fillPaymentDetails(checkoutData);
      await checkoutPage.fillShippingName(`${user.firstName} ${user.lastName}`);
      await checkoutPage.selectCountry(checkoutData.country);
      await expect(checkoutPage.getCountryInputLocator()).toHaveValue(checkoutData.country);
      await checkoutPage.clickPlaceOrder();
    });

    await test.step('Verify the order was placed successfully', async () => {
      await expect(checkoutPage.getOrderConfirmationMessageLocator()).toBeVisible();
    });
  });
});
