import { FrameLocator, Locator, Page } from '@playwright/test';
import test, { expect } from './utils/base.po';
import { step, stepParam, clickElement, fillInputField } from './utils/navigation.po';


export class ResetPasswordFrame {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	//Locators
	readonly iFrameWindow = () => this.page.frameLocator('iframe[src*=\'auth?client_id=frontoffice-client&redirect_uri\']');
	readonly username = () => this.iFrameWindow().locator('#username');
	readonly resetEmail = () => this.iFrameWindow().locator('[placeholder="enter email address"]');
	readonly password = () => this.iFrameWindow().locator('#password');
	readonly loginButton = () => this.iFrameWindow().locator('#kc-login');
	readonly wrongUsername = () => this.iFrameWindow().locator('#input-error');
	readonly wholeLoginWindow = () => this.iFrameWindow().locator('.login-pf');
	readonly noUsername = () => this.iFrameWindow().locator('#input-error');
	readonly noPassword = () => this.iFrameWindow().locator('#input-error');
	readonly resetPasswordButton = () => this.iFrameWindow().locator('#kc-password-reset-link');
	readonly submitButton = () => this.iFrameWindow().locator('.pf-c-button.reset-email-submit.pf-m-primary.pf-m-block.btn-lg');

	//Action

	//TODO: complete refactoring of the methods to use the new navigation methods
	public clickLoginButton = async () => await clickElement(this.loginButton(), 'Login button');

	public clickResetPasswordButton = async () => await clickElement(this.resetPasswordButton(), 'Reset Password button');
	
	public clickSubmitButton = async () => await clickElement(this.submitButton(), 'Submit button');
	
	public fillUsername = async (username: string ) =>
		await fillInputField(this.username(), username, 'Username field');

	public fillResetEmail = async (username: string) =>
		await fillInputField(this.resetEmail(), username, 'Reset email field');

	public fillPassword = async (password: string) =>
		await fillInputField(this.password(), password, 'Password field');

	public async validateSendEmail(): Promise<any> {
		await expect(this.username()).toBeVisible();
	}

	public async validateWrongPasswordUsed(): Promise<any> {
		await expect(this.wrongUsername()).toBeVisible();
		//TODO: enable assertion when localisation is stable
		await expect(this.wrongUsername()).
			toHaveText(' Invalid username or password. ', { ignoreCase: true })
	}

	@stepParam((username: string, password: string) =>
		`I fill in the username field with username ${username} and password ${password}`)
	public async actionLogin(username: string, password: string): Promise<void> {
		await this.fillUsername(username);
		await this.fillPassword(password);
		await this.clickLoginButton();
	}

	@step('I validate the error message for no username used')
	public async validateNoUsernameUsed(): Promise<any> {
		await expect(this.noUsername()).toBeVisible();
		await expect(this.noUsername()).
			toHaveText('Invalid username.', { ignoreCase: true })
	}

	@step('I validate the error message for no password used')
	public async validateErrorMessage(expectedErrorTest: string): Promise<any> {
		await expect(this.noUsername()).toBeVisible();
		await expect(this.noUsername()).
			toHaveText(expectedErrorTest, { ignoreCase: true })
	}

	@step('I validate the error message for no password used')
	public async validateNoPasswordUsed(): Promise<any> {
		await expect(this.noPassword()).toBeVisible();
		await expect(this.noPassword()).
			toHaveText('Invalid username or password.', { ignoreCase: true })
	}

	public async validateWrongUsernameUsed(): Promise<any> {
		await expect(this.wrongUsername()).toBeVisible();
		await expect(this.wrongUsername()).
			toHaveText('Invalid username or password.', { ignoreCase: true })
	}

	public async validateBrowserErrorIsShown (email: Locator, expectedText: string ) {
		const validationMessage = await email.evaluate((element) => {
			const input = element as HTMLInputElement
			return input.validationMessage
		  });
		await expect(validationMessage).toContain(expectedText);
	}

}