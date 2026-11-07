import { test, expect } from '../fixtures';
import { loadData } from '../../../core/data/DataLoader';
import { ENV } from '../../../core/env';
import { SUITE_DIR } from '../config/ClientConfig';
import { CartData } from '../data/TestData';

const cartData = loadData<CartData>(SUITE_DIR, 'cart.data.json');
const { productsToAdd, productToRemove, productNotInCart } = cartData;

test.describe(`RahulShettyClient - Remove from Cart [${ENV}]`, () => {
  test.beforeEach(async ({ loginAsValidUser }) => {
    test.skip(ENV === 'prod', 'Changes a cart - not run on prod');
    // Fresh isolated user per test, so every test starts with an empty cart.
    await loginAsValidUser();
  });

  test('TC07: remove one product from the cart (positive)', { tag: ['@valid', '@smoke', '@cart'] }, async ({ addToCartPage }) => {
    const remaining = productsToAdd.filter((name) => name !== productToRemove);

    await test.step(`TC07: Add ${productsToAdd.length} products to cart`, async () => {
      await addToCartPage.addProductsToCart(productsToAdd);
      await addToCartPage.goToCart();
      const names = await addToCartPage.getCartProductNames();
      expect(names).toEqual(expect.arrayContaining(productsToAdd));
    });

    await test.step(`TC07: Remove "${productToRemove}" and verify count decreased by one`, async () => {
      await addToCartPage.removeProductFromCart(productToRemove);
    });

    await test.step('TC07: Verify the other products are still in the cart', async () => {
      const names = await addToCartPage.getCartProductNames();
      expect(names).toEqual(remaining);
    });
  });

  test('TC08: remove all products from the cart (positive)', { tag: ['@valid', '@regression', '@cart'] }, async ({ addToCartPage }) => {
    await test.step(`TC08: Add ${productsToAdd.length} products to cart`, async () => {
      await addToCartPage.addProductsToCart(productsToAdd);
      await addToCartPage.goToCart();
    });

    await test.step('TC08: Remove every product one by one', async () => {
      const removed = await addToCartPage.removeAllProductsFromCart();
      expect(removed.sort()).toEqual([...productsToAdd].sort());
    });

    await test.step('TC08: Verify the cart is empty', async () => {
      await addToCartPage.expectCartEmpty();
    });
  });

  test('TC09: cannot remove a product that is not in the cart (negative)', { tag: ['@invalid', '@regression', '@cart'] }, async ({ addToCartPage }) => {
    await test.step(`TC09: Add ${productsToAdd.length} products to cart`, async () => {
      await addToCartPage.addProductsToCart(productsToAdd);
      await addToCartPage.goToCart();
    });

    await test.step('TC09: Verify the cart loaded with the added products', async () => {
      const names = await addToCartPage.getCartProductNames();
      expect(names).toEqual(expect.arrayContaining(productsToAdd));
    });

    await test.step(`TC09: Verify "${productNotInCart}" has no row and no delete button`, async () => {
      await expect(addToCartPage.getCartRowLocator(productNotInCart)).toHaveCount(0);
      await expect(addToCartPage.getDeleteButtonLocator(productNotInCart)).toHaveCount(0);
    });

    await test.step('TC09: Verify the cart is unchanged', async () => {
      await addToCartPage.expectCartCount(productsToAdd.length);
      const names = await addToCartPage.getCartProductNames();
      expect(names).toHaveLength(productsToAdd.length);
    });
  });

  test('TC10: empty cart has nothing to remove (negative)', { tag: ['@invalid', '@regression', '@cart'] }, async ({ addToCartPage }) => {
    await test.step('TC10: Open the cart of a new user', async () => {
      await addToCartPage.goToCart();
    });

    await test.step('TC10: Verify empty message, no rows and no delete buttons', async () => {
      await addToCartPage.expectCartEmpty();
      await expect(addToCartPage.getDeleteButtonLocator(productToRemove)).toHaveCount(0);
    });
  });
});
