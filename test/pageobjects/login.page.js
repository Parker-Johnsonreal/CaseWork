import Page from './page.js';

/**
 * Login page for theCaseWork (the login form shows at the base URL).
 * TODO: confirm the username/password selectors with Chrome > Inspect.
 */
class LoginPage extends Page {
    // ----- elements -----
    get inputUsername () {
        return $('aria/Username');            // finds the input labelled "Username"
    }

    get inputPassword () {
        return $('input[type="password"]');
    }

    get btnLogin () {
        return $('button=Login');             // a <button> whose text is exactly "Login"
    }

    // ----- actions -----
    async login (username, password) {
        await this.inputUsername.waitForDisplayed();
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnLogin.click();
        // Logged in once the side navigation shows up
        await $('[data-testid="vert-nav-clients-parties"]').waitForDisplayed({ timeout: 15000 });
    }

    open () {
        return super.open('');
    }
}

export default new LoginPage();
