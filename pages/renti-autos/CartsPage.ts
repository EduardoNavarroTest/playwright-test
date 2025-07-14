import { Locator, Page } from '@playwright/test';

class CartsPage {
    private readonly btnAddToCart: Locator;
    private readonly btnCart: Locator;
    private readonly btnPurchase: Locator;


    constructor(page: Page) {
        this.btnAddToCart = page.locator('.btn.btn-primary.reservar-btn').first()
        this.btnCart = page.locator('#carritoIcono');
        this.btnPurchase = page.getByRole('link', { name: 'Finalizar carrito' })
    }

    async addProductToCart() {
        await this.btnAddToCart.click();
        await this.btnCart.click();
        await this.btnPurchase.click();
    }
}

export default CartsPage;