import { test, expect } from '@playwright/test';
import LoginPage from '../pages/saucedemo/LoginPage';

test.describe("Proceso en la página de Saucedemo", () => {
    let loginPage: LoginPage;
    const URL: string = `https://www.saucedemo.com/`;


    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await page.goto(URL);
    });


    test("Login exitoso en saucedemox", async ({ page }, testInfo) => {
        await loginPage.login();
    });

});