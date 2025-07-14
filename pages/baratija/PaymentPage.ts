import { Locator, Page } from '@playwright/test';

class PaymentPage {
    private readonly name: Locator;
    private readonly email: Locator;
    private readonly phone: Locator;
    private readonly address: Locator;
    private readonly btnConfirm: Locator;
    private readonly btnClean: Locator;


    constructor(page: Page) {
        this.name = page.getByRole('textbox', { name: 'Nombre:' });
        this.email = page.getByRole('textbox', { name: 'Correo Electrónica:' });
        this.phone = page.getByRole('textbox', { name: 'Teléfono:' });
        this.address = page.getByRole('textbox', { name: 'Dirección:' });
        this.btnConfirm = page.getByRole('button', { name: 'Confirmar compra' });
    }

    async finishPurchase() {
        await this.name.fill('Eduardo Navarro');
        await this.email.fill('eduardonavarro.test@gmail.com');
        await this.phone.fill('3001244352');
        await this.address.fill('Calle 123');
        await this.btnConfirm.click();
    }

    async cleanCart() {
        await this.btnClean.click();
    }
}

export default PaymentPage;