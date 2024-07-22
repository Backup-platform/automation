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
	readonly iFrameWindow = () => this.page.frameLocator('iframe[src*=\'auth?client_id=frontoffice-client&redirect_uri\']');
	readonly username = () => this.page.locator('#username');
	readonly password = () => this.page.locator('#password');
	readonly loginButton = () => this.page.locator('#kc-login');
	readonly wrongUsername = () => this.page.locator('#input-error');
	readonly wholeLoginWindow = () => this.page.locator('.login-pf');
	
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
	public async fillUsername(username: string): Promise<void> {
		await this.username().fill(username);
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
}