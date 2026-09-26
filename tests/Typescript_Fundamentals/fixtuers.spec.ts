const user = {
  name: "John Doe",
  email: "john.doe@example.com",
};
import { test, expect } from "@playwright/test";

test("fills the todo input with a user object", async ({ page }) => {
  const { email } = user;

  await page.goto("https://demo.playwright.dev/todomvc");

  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill(email);
  await input.press("Enter");

  await expect(page.getByTestId("todo-item")).toContainText(email);
});
