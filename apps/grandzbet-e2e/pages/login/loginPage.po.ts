import { Page } from '@playwright/test';
import { step, stepParam, fillInputField, assertVisible, clickElement, performNavigationClick, assertEnabled, assertEditable } from '@test-utils/navigation.po';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }    
    // Locators
    private readonly email = () => this.page.locator('input[name=email]');
    private readonly password = () => this.page.locator('input[name=password]');      
    private readonly loginButton = () => this.page.locator('.w-full .space-y-4 button[type="submit"]');
    private readonly resetPasswordButton = () => this.page.locator('a[href="/password-reset"] button');
    private readonly createAccountButton = () => this.page.locator('button.bg-secondary-secondary.text-secondary-foreground');    
    private readonly closeButton = () => this.page.locator('.flex.grow.flex-row.justify-between button.text-greyLight');
    
    private readonly emailError = () => this.page.locator('form p.text-error').first();
    private readonly passwordError = () => this.page.locator('form p.text-error').last();
    private readonly invalidCredentialsError = () => this.page.locator('form button[type="submit"]').locator('..').locator('p.text-error'); 
    
    private readonly emailErrorAlt = () => this.page.locator('input[name="email"]').locator('..').locator('..').locator('p.text-error');
    private readonly passwordErrorAlt = () => this.page.locator('input[name="password"]').locator('..').locator('..').locator('p.text-error');
    
    private readonly forgotPasswordText = () => this.page.locator('span.font-rubik.text-2xs.font-bold.text-greyMain').first();
    private readonly dontHaveAccountText = () => this.page.locator('span.font-rubik.text-2xs.font-bold.text-greyMain').last();

    // Actions
    public clickLoginButton = async () => await clickElement(this.loginButton(), 'Login button');
    
    public clickCloseButton = async () => await clickElement(this.closeButton(), 'Close button');

    public fillPassword = async (password: string) => 
        await fillInputField(this.password(), password, 'Password field');
    
    public fillUsername = async (email: string) =>
        await fillInputField(this.email(), email, 'Email field');

    public validateEmailError = async (softAssert = false) => {
        return await assertVisible(this.emailError().or(this.emailErrorAlt()),
            'Email error', softAssert);
    }

    public validatePasswordError = async (softAssert = false) => {
        return await assertVisible(this.passwordError().or(this.passwordErrorAlt()), 
            'Password error', softAssert);
    }

    public validateInvalidCredentialsError = async (softAssert = false) => {
        return await assertVisible(this.invalidCredentialsError(), 'Invalid user credentials error', softAssert);
    }

    public validateLoginError = async (inputField: 'email' | 'password' | 'credentials', softAssert = false) => {
        await { 
            email: this.validateEmailError, 
            password: this.validatePasswordError,
            credentials: this.validateInvalidCredentialsError 
        }[inputField](softAssert);
    };

    @step('Validate Login page elements are visible, enabled and editable')
    public async validatePageElements(softAssert= false): Promise<void> {
        await this.validatePageElementsVisible(softAssert);
        await this.validatePageElementsEnabled(softAssert);
        await this.validatePageElementsEditable(softAssert);
    }

    @step('I validate the login window elements are visible')
    public async validatePageElementsVisible(softAssert = false): Promise<void> {
        await assertVisible(this.email(), 'email field', softAssert);
        await assertVisible(this.password(), 'Password field', softAssert);
        await assertVisible(this.loginButton(), 'Login button', softAssert);
        await assertVisible(this.closeButton(), 'Back button', softAssert);
        await assertVisible(this.resetPasswordButton(), 'Reset Password button', softAssert);
        await assertVisible(this.createAccountButton(), 'Create Account button', softAssert);
        await assertVisible(this.forgotPasswordText(), 'Forgot Password text', softAssert);
        await assertVisible(this.dontHaveAccountText(), 'Dont have an account text', softAssert);
    }

    @step('I validate the login window elements are enabled')
    public async validatePageElementsEnabled(softAssert = false): Promise<void> {
        await assertEnabled(this.email(), 'email field', softAssert);
        await assertEnabled(this.password(), 'Password field', softAssert);
        await assertEnabled(this.loginButton(), 'Login button', softAssert);
        await assertEnabled(this.closeButton(), 'Back button', softAssert);
        await assertEnabled(this.resetPasswordButton(), 'Reset Password button', softAssert);
        await assertEnabled(this.createAccountButton(), 'Create Account button', softAssert);
    }

    @step('I validate the email and password window elements are editable')
    public async validatePageElementsEditable(softAssert = false): Promise<void> {
        await assertEditable(this.email(), 'email field', softAssert);
        await assertEditable(this.password(), 'Password field', softAssert);
    }

    @stepParam((username, password) => `I log in using username: ${username} and password: ${password}`)
    public async actionLogin(username: string, password: string): Promise<void> {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
    }

    @stepParam((scenario: string, expectedURL: string) => `I validate ${scenario} navigation back to ${expectedURL}`)
    public async validateNavigationBack(scenario: string, expectedURL: string): Promise<void> {
        await performNavigationClick(this.page, this.closeButton(), `Back Button`, expectedURL);
    }
}