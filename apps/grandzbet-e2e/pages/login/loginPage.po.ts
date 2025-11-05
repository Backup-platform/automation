import { Page } from '@playwright/test';
import { step, stepParam } from '@test-utils/decorators';
import { fillElement, clickElement } from '@test-utils/interactions';
import { assertVisible, assertEnabled, assertEditable } from '@test-utils/assertions';
import { performNavigationClick } from '@test-utils/navigation-helpers';
import { compositeLocator } from '@test-utils/core-types';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }    
    // Locators
    private readonly email = compositeLocator(() => this.page.locator('input[name=email]'), 'Email field');
    private readonly password = compositeLocator(() => this.page.locator('input[name=password]'), 'Password field');      
    private readonly loginButton = compositeLocator(() => this.page.locator('.w-full .space-y-4 button[type="submit"]'), 'Login button');
    private readonly resetPasswordButton = compositeLocator(() => this.page.locator('a[href="/password-reset"] button'), 'Reset password button');
    private readonly createAccountButton = compositeLocator(() => this.page.locator('button.bg-secondary-secondary.text-secondary-foreground'), 'Create account button');    
    private readonly closeButton = compositeLocator(() => this.page.locator('.flex.grow.flex-row.justify-between button.text-greyLight'), 'Close button');
    
    private readonly emailError = compositeLocator(() => this.page.locator('form p.text-error').first(), 'Email error');
    private readonly passwordError = compositeLocator(() => this.page.locator('form p.text-error').last(), 'Password error');
    private readonly invalidCredentialsError = compositeLocator(() => this.page.locator('form button[type="submit"]').locator('..').locator('p.text-error'), 'Invalid credentials error'); 
    
    private readonly emailErrorAlt = compositeLocator(() => this.page.locator('input[name="email"]').locator('..').locator('..').locator('p.text-error'), 'Email error alt');
    private readonly passwordErrorAlt = compositeLocator(() => this.page.locator('input[name="password"]').locator('..').locator('..').locator('p.text-error'), 'Password error alt');
    
    private readonly forgotPasswordText = compositeLocator(() => this.page.locator('span.font-rubik.text-2xs.font-bold.text-greyMain').first(), 'Forgot password text');
    private readonly dontHaveAccountText = compositeLocator(() => this.page.locator('span.font-rubik.text-2xs.font-bold.text-greyMain').last(), 'Dont have account text');

    // Actions
    public clickLoginButton = async () => await clickElement(this.loginButton);
    
    public clickCloseButton = async () => await clickElement(this.closeButton);

    public fillPassword = async (password: string) => 
        await fillElement(this.password, password);
    
    public fillUsername = async (email: string) =>
        await fillElement(this.email, email);

    public validateEmailError = async (softAssert = false) => {
        return await assertVisible(compositeLocator(() => this.emailError.locator().or(this.emailErrorAlt.locator()), 'Email error'), softAssert);
    }

    public validatePasswordError = async (softAssert = false) => {
        return await assertVisible(compositeLocator(() => this.passwordError.locator().or(this.passwordErrorAlt.locator()), 'Password error'), softAssert);
    }

    public validateInvalidCredentialsError = async (softAssert = false) => {
        return await assertVisible(this.invalidCredentialsError, softAssert);
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
        await assertVisible(this.email, softAssert);
        await assertVisible(this.password, softAssert);
        await assertVisible(this.loginButton, softAssert);
        await assertVisible(this.closeButton, softAssert);
        await assertVisible(this.resetPasswordButton, softAssert);
        await assertVisible(this.createAccountButton, softAssert);
        await assertVisible(this.forgotPasswordText, softAssert);
        await assertVisible(this.dontHaveAccountText, softAssert);
    }

    @step('I validate the login window elements are enabled')
    public async validatePageElementsEnabled(softAssert = false): Promise<void> {
        await assertEnabled(this.email, softAssert);
        await assertEnabled(this.password, softAssert);
        await assertEnabled(this.loginButton, softAssert);
        await assertEnabled(this.closeButton, softAssert);
        await assertEnabled(this.resetPasswordButton, softAssert);
        await assertEnabled(this.createAccountButton, softAssert);
    }

    @step('I validate the email and password window elements are editable')
    public async validatePageElementsEditable(softAssert = false): Promise<void> {
        await assertEditable(this.email, softAssert);
        await assertEditable(this.password, softAssert);
    }

    @stepParam((username, password) => `I log in using username: ${username} and password: ${password}`)
    public async actionLogin(username: string, password: string): Promise<void> {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
    }

    @stepParam((scenario: string, expectedURL: string) => `I validate ${scenario} navigation back to ${expectedURL}`)
    public async validateNavigationBack(scenario: string, expectedURL: string): Promise<void> {
        await performNavigationClick(this.page, this.closeButton, expectedURL);
    }
}