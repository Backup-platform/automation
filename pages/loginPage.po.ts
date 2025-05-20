import { Locator, Page } from '@playwright/test';
import { step, stepParam, fillInputField, assertVisible, clickElement, performNavigationClick } from './utils/navigation.po';
import { BottomMenu } from './mobileMenu/bottomMenu.po';


export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    readonly wholeLoginWindow = () => this.page.locator('.login-pf');
    readonly usernameField = () => this.page.locator('#username');
    readonly passwordField = () => this.page.locator('#password');
    readonly loginButton = () => this.page.locator('#kc-login');
    readonly backButton = () => this.page.locator('#kc-back');
    readonly resetPasswordLink = () => this.page.locator('#kc-password-reset-link');
    readonly inputError = () => this.page.locator('#input-error');

    // Actions

    public fillUsername = async (username: string) => await fillInputField(this.usernameField(), username, 'Username field');

    public fillPassword = async (password: string) => await fillInputField(this.passwordField(), password, 'Password field');

    public clickLoginButton = async () => await clickElement(this.loginButton(), 'Login Button');

    public clickBackButton = async (url: string) => await this.navigateToMenuItem(this.backButton(), 'Back Button', url);

    public clickResetPasswordLink = async () => await clickElement(this.resetPasswordLink(), 'Reset Password link');
    
    public validateInputErrorVisible = async (softAssert = false) => 
        await assertVisible(this.inputError(), 'Input error', softAssert);

    private navigateToMenuItem = (
            locator: Locator,
            label: string,
            url: string
        ) => performNavigationClick(this.page, locator, `${label} menu button`, url);

    @step('I validate the login window elements are visible')
    public async validateLoginWindowElementsVisible(softAssert = false): Promise<void> {
        await assertVisible(this.wholeLoginWindow(), 'Login window', softAssert);
        await assertVisible(this.usernameField(), 'Username field', softAssert);
        await assertVisible(this.passwordField(), 'Password field', softAssert);
        await assertVisible(this.loginButton(), 'Login button', softAssert);
        await assertVisible(this.backButton(), 'Back button', softAssert);
        await assertVisible(this.resetPasswordLink(), 'Reset Password link', softAssert);
    }

    @stepParam((username, password) => `I log in using username: ${username} and password: ${password}`)
    public async actionLogin(username: string, password: string, softAssert = false): Promise<void> {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
    }

    @stepParam((scenario: string, expectedURL: string) => `I validate ${scenario} navigation back to ${expectedURL}`)
    public async validateNavigationBack(scenario: string, expectedURL: string): Promise<void> {
        await performNavigationClick(this.page, this.backButton(), `Back Button`, expectedURL);
    }
}