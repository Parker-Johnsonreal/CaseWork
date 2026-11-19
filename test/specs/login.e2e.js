import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page.js';

describe('theCaseWork - Login', () => {
    beforeEach(async () => {
        await LoginPage.open();
    });

    it('should show the login form', async () => {
        await expect(LoginPage.inputUsername).toBeDisplayed();
        await expect(LoginPage.inputPassword).toBeDisplayed();
        await expect(LoginPage.btnLogin).toBeDisplayed();
    });
});
