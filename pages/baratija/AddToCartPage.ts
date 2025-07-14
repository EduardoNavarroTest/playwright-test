import { Locator, Page } from '@playwright/test';

class AddToCartPage {
    private readonly btnAddToCart: Locator


    constructor(page: Page) {
        this.btnAddToCart = page.locator('.btn.btn-primary.reservar-btn').first()
    }

    async addToCart() {
        await this.btnAddToCart.click();
    }
}

export default AddToCartPage;