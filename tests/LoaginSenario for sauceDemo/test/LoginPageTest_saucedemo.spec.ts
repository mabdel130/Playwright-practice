import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage_saucedemo";

test.use({ launchOptions: { slowMo: 1000 } });

test("verifies that the default user logged Successfully with valid data  and is redirected to the inventory page", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login("standard_user", "secret_sauce");

    await expect(loginPage.page).toHaveURL("https://www.saucedemo.com/inventory.html");
    await expect(loginPage.page.locator(".app_logo")).toHaveText("Swag Labs");
});