import { test, expect } from '@playwright/test';
import CartsPage from '../pages/renti-autos/CartsPage';
import ShopPage from '../pages/renti-autos/ShopPage';


test.describe("Proceso de compra en reinti-autos", () => {    
    let cartsPage: CartsPage;
    let shopPage: ShopPage;
    const URL: string = `https://eduardonavarrotest.github.io/js-coder/`;


    test.beforeEach(async ({ page }) => {
        cartsPage = new CartsPage(page);
        shopPage = new ShopPage(page);
        await page.goto(URL);
    });
    
    test("Agregar vehiculo al carrito y finalizar compra", async ({ page }, testInfo) => {
        await cartsPage.addProductToCart();
        await shopPage.finalizePurchase();
        
    });


});