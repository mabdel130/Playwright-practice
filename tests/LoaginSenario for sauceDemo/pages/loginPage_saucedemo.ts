import { type Page } from "@playwright/test";
import { BasePage_saucedemo } from "./BasePage_saucedemo";


export class LoginPage extends BasePage_saucedemo {
    constructor(page: Page) {
        super(page);
    }

    override async open(): Promise<void> {
        await super.open();

    }

    public async login(username: string, password: string): Promise<void> {
        await this.page.getByPlaceholder('Username').fill(username);
        await this.page.getByPlaceholder('Password').fill(password);
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

}
