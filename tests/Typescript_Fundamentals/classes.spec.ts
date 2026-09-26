import { test, expect, type Page, type Locator } from "@playwright/test";

test.use({ launchOptions: 
    { slowMo: 1000 } });

class ToDoPage {
    static readonly URL = "https://demo.playwright.dev/todomvc";
    private readonly page: Page;
    public readonly todoitem: Locator;
    public readonly todoinput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.todoinput = page.getByPlaceholder("What needs to be done?");
        this.todoitem = page.getByTestId("todo-item");
    }

    public async open(): Promise<void> {
        await this.page.goto(ToDoPage.URL);
    }

    public async toDoItem(title: string): Promise<void> {
        await this.todoinput.fill(title);
        await this.todoinput.press("Enter");
    }
}

test("add to do items", async ({ page }) => {
    const addItem = new ToDoPage(page);

    await addItem.open();
    await addItem.toDoItem("Learn Playwright with omar zidan");
    
    await expect(addItem.todoitem).toHaveCount(1);
    await expect(addItem.todoitem).toContainText("Learn Playwright with omar zidan");
});
