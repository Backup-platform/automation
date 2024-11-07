import { FrameLocator, Locator, Page } from '@playwright/test';
import test, { expect } from '../pages/utils/base.po';

export class LogInIFrame {
	readonly page: Page;

	readonly locators = {
		iFrameWindow: 'iframe[src*=\'auth?client_id=frontoffice-client&redirect_uri\']',
		loginButton: '#kc-login',
	};

	constructor(page: Page) {
		this.page = page;
	}

	//Locators
	readonly loginWindow = () => this.page.locator('.kc-content-container');
	readonly username = () => this.page.locator('#username');
	readonly resetEmail = () => this.page.getByPlaceholder('enter email address');
	readonly password = () => this.page.locator('#password');
	readonly loginButton = () => this.page.locator('#kc-login');
	readonly wrongUsername = () => this.page.locator('#input-error');
	readonly wholeLoginWindow = () => this.page.locator('.login-pf');
	readonly noUsername = () => this.page.locator('#input-error');
	readonly noPassword = () => this.page.locator('#input-error');
	readonly resetPasswordButton = () => this.page.locator('#kc-password-reset-link');
	readonly submitButton = () => this.page.locator('.pf-c-button.reset-email-submit.pf-m-primary.pf-m-block.btn-lg');

	//Action
	/**
	 * TODO: this is to illustrate old code
	 */
	// public async clickLogin(): Promise<void> {
	// 	await this.page.frameLocator(this.locators.iFrameWindow).locator(this.locators.loginButton).click();
	// }

	public async clickLoginButton(): Promise<void> {
		await this.loginButton().click();
	}

	public async clickResetPasswordButton(): Promise<void> {
		await this.loginWindow().locator(this.resetPasswordButton()).click();
	}

	public async clickSubmitButton(): Promise<void> {
		await this.loginWindow().locator(this.submitButton()).click();
	}

	public async fillUsername(username: string): Promise<void> {
		await this.username().fill(username);
	}

	public async fillResetEmail(username: string): Promise<void> {
		await this.loginWindow().locator(this.resetEmail()).fill(username);
	}

	public async fillPassword(password: string): Promise<void> {
		await this.password().fill(password);
	}

	public async validateWrongPasswordUsed(): Promise<any> {
		await expect(this.wrongUsername()).toBeVisible();
		//TODO: enable assertion when localisation is stable
		await expect(this.wrongUsername()).toHaveText('Invalid username or password.', {ignoreCase: true})
	}

	public async actionLogin(username: string, password: string): Promise<void> {
		await this.fillUsername(username);
		await this.fillPassword(password);
		await this.clickLoginButton();
	}
	public async validateNoUsernameUsed(): Promise<any> {
		await expect(this.loginWindow().locator(this.noUsername())).toBeVisible();
		await expect(this.loginWindow().locator(this.noUsername())).
			toHaveText('Invalid username.', { ignoreCase: true })
	}

	public async validateErrorMessage(expectedErrorTest: string): Promise<any> {
		await expect(this.loginWindow().locator(this.noUsername())).toBeVisible();
		await expect(this.loginWindow().locator(this.noUsername())).
			toHaveText(expectedErrorTest, { ignoreCase: true })
	}

	public async validateNoPasswordUsed(): Promise<any> {
		await expect(this.loginWindow().locator(this.noPassword())).toBeVisible();
		await expect(this.loginWindow().locator(this.noPassword())).
			toHaveText('Invalid username or password.', { ignoreCase: true })
	}

	public async validateSendEmail(): Promise<any> {
		await expect(this.loginWindow().locator(this.username())).toBeVisible(); //TODO: 
	}

	public async validateWrongUsernameUsed(): Promise<any> {
		await expect(this.loginWindow().locator(this.wrongUsername())).toBeVisible();
		await expect(this.loginWindow().locator(this.wrongUsername())).
			toHaveText('Invalid username or password.', { ignoreCase: true })
	}

}