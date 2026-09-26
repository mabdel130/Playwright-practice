import { test, expect } from "@playwright/test";

test("creates each todo from an array", async ({ page }) => {
  await page.goto("https://demo.playwright.dev/todomvc");

  const todos: any[] = ["Buy milk", "Write test", "Ship it"];
  const input = page.getByPlaceholder("What needs to be done?");

  for (const todo of todos) {
    await input.fill(todo);
    await input.press("Enter");
  }

  await expect(page.getByTestId("todo-item")).toHaveCount(todos.length);
  await expect(page.getByTestId("todo-item")).toHaveText(todos);
});
