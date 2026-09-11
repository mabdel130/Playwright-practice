import { type Page, type Locator } from "@playwright/test";

export  class BasePage_saucedemo {

    static readonly BASE_URL = "https://www.saucedemo.com/";

    constructor(readonly page: Page) {
    }

    public async open(): Promise<void> {
        await this.page.goto(BasePage_saucedemo.BASE_URL);
    }
}
