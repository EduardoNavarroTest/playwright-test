import { Locator, Page } from '@playwright/test';

class LoginPage {
    private readonly username: Locator;
    private readonly password: Locator;
    private readonly btnLogin: Locator;
    constructor(page: Page) {
        this.username = page.locator('#user-name');
        this.password = page.locator('#password');
        this.btnLogin = page.locator('#login-button');
    }

    async login() {
        await this.username.fill('standard_user');
        await this.password.fill('secret_sauce');
        await this.btnLogin.click();
    }

}

export default LoginPage;