import { test, expect } from '@playwright/test';
import AddToCartPage from '../pages/baratija/AddToCartPage';
import StartPage from '../pages/baratija/StartPage';
import PaymentPage from '../pages/baratija/PaymentPage';

test.describe("Proceso de compra en página LaBaratija", () => {
    let addToCartPage: AddToCartPage;
    let startPage: StartPage;
    let paymentPage: PaymentPage;
    const URL: string = ` https://baratijas.vercel.app`;


    test.beforeEach(async ({ page }) => {
        addToCartPage = new AddToCartPage(page);
        startPage = new StartPage(page);
        paymentPage = new PaymentPage(page);
        await page.goto(URL);
    });

    test("Agregar audifonos al carrito y finalizar compra", async ({ page }, testInfo) => {
        startPage.details();
        addToCartPage.addToCart();
        startPage.cartIcon();
        paymentPage.finishPurchase();

    });

    test("Agregar camiseta y eliminar el carrito", async ({ page }, testInfo) => {
        startPage.details();
        addToCartPage.addToCart();
        startPage.cartIcon();
        paymentPage.cleanCart();
    });

    test("Fallar prueba a proposito", async ({ page }, testInfo) => {
        expect(1).toBe(2);
    });


});