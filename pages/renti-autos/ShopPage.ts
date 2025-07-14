import { Locator, Page } from '@playwright/test';

class ShopPage {
    private readonly id: Locator;
    private readonly name: Locator;
    private readonly lastName: Locator;
    private readonly email: Locator;
    private readonly phone: Locator;
    private readonly address: Locator;
    private readonly payment: Locator;
    private readonly btnFinalize: Locator;


    constructor(page: Page) {
        this.id = page.locator('#id');
        this.name = page.getByRole('textbox', { name: 'Nombre:' })
        this.lastName = page.getByRole('textbox', { name: 'Apellido:' })
        this.email = page.getByRole('textbox', { name: 'Correo Electrónico:' })
        this.phone = page.getByRole('textbox', { name: 'Teléfono:' })
        this.address = page.getByRole('textbox', { name: 'Dirección:' })
        this.payment = page.getByLabel('Medio de Pago:')
        this.btnFinalize = page.getByRole('button', { name: 'Finalizar compra' })
    }

    async finalizePurchase() {
        await this.id.fill('123456');
        await this.name.fill('Eduardo');
        await this.lastName.fill('Navarro');
        await this.email.fill('eduardonavarro.test@gmail.com');
        await this.phone.fill('3001244352');
        await this.address.fill('Calle 123');
        await this.payment.selectOption('Efectivo');
        await this.btnFinalize.click();
    }
}

export default ShopPage;