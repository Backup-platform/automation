import { Page } from '@playwright/test';
import test, { expect } from '../pages/utils/base.po';

export class LandingPage {

	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	//Locators
	readonly loginButton = () => this.page.locator('#header-log-in-btn');
	readonly resetPasswordButton = () => this.page.locator('#kc-password-reset-link');
	readonly submitButton = ()  => this.page.locator('.pf-c-button reset-email-submit pf-m-primary pf-m-block btn-lg');
	readonly acceptCookiesButton = () => this.page.getByRole('button', { name: 'Accept' });
	readonly cookiesBanner = () => this.page.getByRole('heading', { name: 'We use cookies to improve your experience.' });

	//Actions
	public async clickLoginButton(): Promise<void> {
		await this.loginButton().click();
	}

	public async clickResetPasswordButton(): Promise<void> {
		await this.resetPasswordButton().click();
	}

	public async clickSubmitButton(): Promise<void> {
		await this.submitButton().click();
	}

	public async isLoginButtonVisible(): Promise<void> {
		await expect(this.loginButton()).toBeVisible();
	}

	public async clickAcceptCookiesButton(): Promise<void> {
		await this.acceptCookiesButton().click();
	}

	public async acceptCookiesBannerRandom(): Promise<void> {
		await test.step('Click Accept if cookies banner is visible', async () => {
			await this.page.addLocatorHandler(
				this.cookiesBanner(), async () => {
					await this.acceptCookiesButton().click();
				});
		});
	}
}
