import { type Page, type Locator } from "@playwright/test";
import { SelfHealingLocator } from "../utils/SelfHealingLocator";

export  class BasePage_saucedemo {

    static readonly BASE_URL = "https://www.saucedemo.com/";
    protected healingLocator: SelfHealingLocator;

    constructor(readonly page: Page) {
        this.healingLocator = new SelfHealingLocator(page);
    }

    public async open(): Promise<void> {
        await this.page.goto(BasePage_saucedemo.BASE_URL);
    }

    async clickWithHealing(primary: Locator, backups: Locator[] = []): Promise<void> {
        await this.healingLocator.clickWithHealing(primary, backups);
    }

    async fillWithHealing(value: string, primary: Locator, backups: Locator[] = []): Promise<void> {
        await this.healingLocator.fillWithHealing(value, primary, backups);
    }
}
