import { expect, Locator, Page } from '@playwright/test';

class ShopPage {
    private readonly find: Locator;
    private readonly product: Locator;
    private readonly buy: Locator;




    constructor(page: Page) {
        this.find = page.getByRole('combobox', { name: 'Ingresa lo que quieras' });
        this.product = page.getByRole('listitem').filter({ hasText: 'Macbook Air 13 Pulgadas Chip M4 16gb 256gb 2025$6.899.900$4.429.90035% OFF3' }).getByRole('link');
        this.buy = page.getByRole('button', { name: 'Comprar ahora' })
    }

    async findMacbookM4() {
        await this.find.fill('macbook m4');
        await this.find.press('Enter');
        await this.product.waitFor({ state: 'visible' });
        await this.product.click();
        await this.buy.waitFor({ state: 'visible' });
        await this.buy.click();
    }
}

export default ShopPage;