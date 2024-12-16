import { Locator, Page } from '@playwright/test';
import test, { expect } from './utils/base.po';
import { Navigation, step, stepParam } from './utils/navigation.po';
import { HeaderMenuDesktop } from './headerMenuDesktop.po';
import { BottomMenu } from './mobileMenu/bottomMenu.po';

export class LoginPage {
    readonly page: Page;
    readonly navigation: Navigation;
    readonly headerMenu: HeaderMenuDesktop;
    readonly bottomMenu: BottomMenu;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page);
        this.headerMenu = new HeaderMenuDesktop(page);
        this.bottomMenu = new BottomMenu(page);
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
    private async validateElements(
        elements: { locator: Locator; shouldBeVisible: boolean; description: string }[],
        softAssert: boolean
    ): Promise<void> {
        for (const { locator, shouldBeVisible, description } of elements) {
            if (shouldBeVisible) {
                await this.navigation.assertVisible(locator, softAssert, description);
            } else {
                await this.navigation.assertNotVisible(locator, softAssert, description);
            }
        }
    }

    @step('I fill in the username')
    public async fillUsername(username: string, softAssert = false): Promise<void> {
        await this.navigation.fillInputField(this.usernameField(), username, softAssert, 'Username field');
    }

    @step('I fill in the password')
    public async fillPassword(password: string, softAssert = false): Promise<void> {
        await this.navigation.fillInputField(this.passwordField(), password, softAssert, 'Password field');
    }

    @step('I click on the login button')
    public async clickLoginButton(softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.loginButton(), softAssert, 'Login Button');
    }

    @step('I click on the back button')
    public async clickBackButton(softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.backButton(), softAssert, 'Back Button');
    }

    @step('I click on the reset password link')
    public async clickResetPasswordLink(softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.resetPasswordLink(), softAssert, 'Reset Password link');
    }

    // Validations
    @step('I validate the login window elements are visible')
    public async validateLoginWindowElementsVisible(softAssert = false): Promise<void> {
        const elements = [
            { locator: this.wholeLoginWindow(), shouldBeVisible: true, description: 'Login window' },
            { locator: this.usernameField(), shouldBeVisible: true, description: 'Username field' },
            { locator: this.passwordField(), shouldBeVisible: true, description: 'Password field' },
            { locator: this.loginButton(), shouldBeVisible: true, description: 'Login button' },
            { locator: this.backButton(), shouldBeVisible: true, description: 'Back button' },
            { locator: this.resetPasswordLink(), shouldBeVisible: true, description: 'Reset Password link' },
        ];

        await this.validateElements(elements, softAssert);
    }

    @step('I validate an input error is visible')
    public async validateInputErrorVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.inputError(), softAssert, 'Input error');
    }

    @stepParam((username, password) => `I log in using username: ${username} and password: ${password}`)
    public async actionLogin(username: string, password: string, softAssert = false): Promise<void> {
        await this.fillUsername(username, softAssert);
        await this.fillPassword(password, softAssert);
        await this.clickLoginButton(softAssert);
    }

    @step('I validate desktop login state')
    public async validateDesktopLoginState(loggedIn: boolean): Promise<void> {
        const elements = [
            { locator: this.headerMenu.myProfileButton(), shouldBeVisible: loggedIn, description: 'My Profile button' },
            { locator: this.headerMenu.balance(), shouldBeVisible: loggedIn, description: 'Balance' },
            { locator: this.headerMenu.depositButton(), shouldBeVisible: loggedIn, description: 'Deposit button' },
            { locator: this.loginButton(), shouldBeVisible: !loggedIn, description: 'Login button' },
            { locator: this.headerMenu.registerButton(), shouldBeVisible: !loggedIn, description: 'Register button' },
        ];
        await this.validateElements(elements, false);
    }

    @step('I validate mobile login state')
    public async validateMobileLoginState(loggedIn: boolean): Promise<void> {
        const elements = [
            { locator: this.bottomMenu.gamesButton(), shouldBeVisible: loggedIn, description: 'Games button' },
            { locator: this.bottomMenu.depositButton(), shouldBeVisible: loggedIn, description: 'Deposit button' },
            { locator: this.bottomMenu.myBonusesButton(), shouldBeVisible: loggedIn, description: 'My Bonuses button' },
            { locator: this.bottomMenu.loginButton(), shouldBeVisible: !loggedIn, description: 'Login button' },
            { locator: this.bottomMenu.registerButton(), shouldBeVisible: !loggedIn, description: 'Register button' },
        ];
        await this.validateElements(elements, false);
    }

    @step('I validate navigation back to {scenario}')
    public async validateNavigationBack(scenario: string, expectedURL: string): Promise<void> {
        await this.clickBackButton();
        await expect(this.page).toHaveURL(expectedURL, { timeout: 5000 });
    }
}
