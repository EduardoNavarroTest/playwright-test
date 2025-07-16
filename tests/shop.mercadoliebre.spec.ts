import { test, expect } from '@playwright/test';
import ShopPage from '../pages/mercadolibre/ShopPage';


test.describe("Proceso de en mercadolibre", () => {    
    let shopPage: ShopPage;
    const URL: string = `https://mercadolibre.com.co`;


    test.beforeEach(async ({ page }) => {
        shopPage = new ShopPage(page);
        await page.goto(URL);
    });
    
    test("Agregar macbook en mercadolibre", async ({ page }, testInfo) => {
        await shopPage.findMacbookM4();
        
    });


});