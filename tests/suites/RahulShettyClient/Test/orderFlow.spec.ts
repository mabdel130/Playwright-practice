import { test, expect } from '../fixtures';
import { loadData } from '../../../core/data/DataLoader';
import { ENV } from '../../../core/env';
import { SUITE_DIR } from '../config/ClientConfig';
import { OrderFlowData } from '../data/TestData';
import { CreateOrderResult } from '../pages/CheckoutPage';

const orderData = loadData<OrderFlowData>(SUITE_DIR, 'order.data.json');

test.describe(`RahulShettyClient - Order Flow [${ENV}]`, () => {
  test.beforeEach(async ({ loginAsValidUser }) => {
    test.skip(ENV === 'prod', 'Creates users/orders - not run on prod');
    await loginAsValidUser();
  });

  test('TC11: add 2 products, checkout and verify product IDs match JSON data (positive)', async ({
    page, logger, addToCartPage, checkoutFlow, ordersPage, autoScreenshot,
  }) => {
    const { products, checkout } = orderData;
    const productNames = products.map((p) => p.name);
    const nameById = new Map(products.map((p) => [p.id, p.name]));
    let order: CreateOrderResult = { orderIds: [], productIds: [] };

    for (const product of products) {
      await test.step(`TC11: View "${product.name}" and verify product ID = ${product.id}`, async () => {
        const actualId = await addToCartPage.openProductDetailsAndGetId(product.name);
        expect(actualId, `Product ID of "${product.name}"`).toBe(product.id);
        await addToCartPage.goto();
      });
    }

    await test.step('TC11: Add products, checkout and verify product IDs in API response match JSON data', async () => {
      order = await checkoutFlow.purchase(productNames, checkout, checkout.nameOnCard);
      expect([...order.productIds].sort()).toEqual(products.map((p) => p.id).sort());
    });

    await test.info().attach('order-product-ids.json', {
      contentType: 'application/json',
      body: JSON.stringify(
        order.orderIds.map((orderId, i) => ({ orderId, productId: order.productIds[i], productName: nameById.get(order.productIds[i]) })),
        null,
        2,
      ),
    });

    await test.step('TC11: Open Orders tab and verify only this session\'s orders are listed', async () => {
      await ordersPage.openFromNav();
      await expect(page).toHaveURL(/myorders/);
      await expect(ordersPage.getOrderRowsLocator()).toHaveCount(products.length);
    });

    for (const [i, orderId] of order.orderIds.entries()) {
      const productId = order.productIds[i];
      const productName = nameById.get(productId) ?? '';
      await test.step(`TC11: Order ${orderId} -> "${productName}" (product ID ${productId}): verify row and View details`, async () => {
        await expect(ordersPage.getOrderRowLocator(orderId)).toContainText(productName);
        await ordersPage.viewOrder(orderId);
        await expect(page).toHaveURL(new RegExp(`/order-details/${orderId}$`));
        await expect(ordersPage.getOrderDetailsTextLocator(orderId)).toBeVisible();
        await expect(ordersPage.getOrderDetailsTextLocator(productName)).toBeVisible();
      });
      await ordersPage.openFromNav();
      await expect(ordersPage.getOrderRowsLocator()).toHaveCount(products.length);
    }

    logger.info(`Verified products [${products.map((p) => `${p.name}=${p.id}`).join(', ')}]`);
  });
});
