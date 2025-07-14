import { Locator, Page } from '@playwright/test';

class StartPage {
    private readonly btnDetails: Locator;
    private readonly cart: Locator


    constructor(page: Page) {
        this.btnDetails = page.locator('.btn.btn-primary.reservar-btn').first()
        this.cart = page.locator('#carritoIcono');
    }

    async details() {
        await this.btnDetails.click();
    }

    async cartIcon() {
        await this.cart.click();
    }
}

export default StartPage;