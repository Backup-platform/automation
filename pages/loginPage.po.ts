import { FrameLocator, Locator, Page } from '@playwright/test';
import test, { expect } from './utils/base.po';
import { Navigation } from './utils/navigation.po';
import { HeaderMenuDesktop } from './headerMenuDesktop.po';

export class LoginPage {
	readonly page: Page;
	readonly navigation: Navigation
	readonly headerMenu: HeaderMenuDesktop

	readonly pageProperties = {
		url: '',
	};


	constructor(page: Page) {
		this.page = page;
		this.navigation = new Navigation(page);
		this.headerMenu = new HeaderMenuDesktop(page);
	}

	//Locators - should work for both mobile and desktop
	readonly wholeLoginWindow = () => this.page.locator('.login-pf');
	readonly pageTitle = () => this.page.locator('#kc-page-title');
	readonly pageSubtitle = () => this.page.locator('.jump-back-in');
	readonly username = () => this.page.locator('#username');
	readonly password = () => this.page.locator('#password');
	readonly forgotPasswordText = () => this.page.locator('.forgotPassword');
	readonly resetPasswordLink = () => this.page.locator('#kc-password-reset-link');
	readonly loginButton = () => this.page.locator('#kc-login');
	readonly backButton = () => this.page.locator('#kc-back');
	readonly inputError = () => this.page.locator('#input-error');


	//Actions

	public async validateWholeLoginWindowVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.wholeLoginWindow(), softAssert, 'Expect the whole login window to be visible');
	}

	public async validatePageTitleVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.pageTitle(), softAssert, 'Expect the page title to be visible');
	}

	public async validatePageSubtitleVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.pageSubtitle(), softAssert, 'Expect the page subtitle to be visible');
	}

	public async validateUsernameFieldVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.username(), softAssert, 'Expect the username field to be visible');
	}

	public async validatePasswordFieldVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.password(), softAssert, 'Expect the password field to be visible');
	}

	public async validateForgotPasswordTextVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.forgotPasswordText(), softAssert, 'Expect the forgot password text to be visible');
	}

	public async validateResetPasswordLinkVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.resetPasswordLink(), softAssert, 'Expect the reset password link to be visible');
	}

	public async validateLoginButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.loginButton(), softAssert, 'Expect the login button to be visible');
	}

	public async validateBackButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.backButton(), softAssert, 'Expect the back button to be visible');
	}

	public async validateInputErrorVisible(softAssert = false): Promise<any> {
		await this.navigation.assertVisible(this.inputError(), softAssert, 'Expect the input error is visible');
	}


	public async clickLoginButton(softAssert = false): Promise<void> {
		await test.step('I click on the login button', async () => {
			await this.navigation.clickElement(this.loginButton(), softAssert, 'Expect the login button to be visible');
		});
	}

	public async clickBackButton(softAssert = false): Promise<void> {
		await test.step('I click on the back button', async () => {
			await this.navigation.clickElement(this.backButton(), softAssert, 'Expect the back button to be visible');
		});
	}

	public async clickResetPasswordLink(softAssert = false): Promise<void> {
		await test.step('I click on the reset password link', async () => {
			await this.navigation.clickElement(this.resetPasswordLink(), softAssert, 'Expect the reset password link to be visible');
		});
	}

	public async fillUsername(username: string, softAssert = false): Promise<void> {
		await test.step('I fill in the username', async () => {
			await this.navigation.fillInputField(this.username(), username, softAssert, 'Username field');
		});
	}

	public async fillPassword(password: string, softAssert = false): Promise<void> {
		await test.step('I fill in the password', async () => {
			await this.navigation.fillInputField(this.password(), password, softAssert, 'Password field');
		});
	}

	public async actionLogin(username: string, password: string, softAssert = false): Promise<void> {
		await test.step(`I log in using username: ${username} and password: ${password}`, async () => {
			await this.fillUsername(username, softAssert);
			await this.fillPassword(password, softAssert);
			await this.clickLoginButton(softAssert);
			//TODO: adding explicit wait await this.page.waitForURL(`${process.env.URL}`, {waitUntil: "load" });
			await this.page.waitForTimeout(10000);
		});
	}


	/**
	 * Validate visibility of the elements in the login window.
	 * @param softAssert - true for soft assertions, false for strict assertions
	 */
	public async validateLoginWindowElementsVisible(softAssert = false): Promise<void> {
		const elementsToValidate = [
			{ element: this.wholeLoginWindow(), message: 'Expect the whole login window to be visible' },
			{ element: this.pageTitle(), message: 'Expect the page title to be visible' },
			//TODO: Issue { element: this.pageSubtitle(), message: 'Expect the page subtitle to be visible' },
			{ element: this.username(), message: 'Expect the username field to be visible' },
			{ element: this.password(), message: 'Expect the password field to be visible' },
			{ element: this.forgotPasswordText(), message: 'Expect the forgot password text to be visible' },
			{ element: this.resetPasswordLink(), message: 'Expect the reset password link to be visible' },
			{ element: this.loginButton(), message: 'Expect the login button to be visible' },
			{ element: this.backButton(), message: 'Expect the back button to be visible' },
		];

		await Promise.all(elementsToValidate.map(({ element, message }) =>
			this.navigation.assertVisible(element, softAssert, message)
		));
	}

	/**
	 * Validates that a user is in the logged-in state by checking the visibility of specific elements.
	 * Asserts that elements only visible to logged-in users are displayed, and elements exclusive to non-logged-in users are hidden.
	 * Note: The shortcut button visibility check is temporarily commented out and marked as a TODO.
	 */
	public async validateLoggedIn(): Promise<void> {
		await test.step('I validate user is logged in', async () => {
			// TODO: Uncomment and test shortcut button visibility check
			// await assert(this.headerMenu.shortcutButton().isVisible()).toBeTruthy();
			await expect(this.loginButton()).not.toBeVisible();
			await expect(this.headerMenu.registerButton()).not.toBeVisible();
			await expect(this.headerMenu.myProfileButton()).toBeVisible();
			await expect(this.headerMenu.balance()).toBeVisible();
			await expect(this.headerMenu.depositButton()).toBeVisible();
		});
	}

	/**
	 * Validates that a user is in the not-logged-in state by checking the visibility of specific elements.
	 * Asserts that elements visible only to non-logged-in users are displayed, and elements exclusive to logged-in users are hidden.
	 * Note: The shortcut button visibility check is temporarily commented out and marked as a TODO.
	 */
	public async validateNOTLoggedIn(): Promise<void> {
		await test.step('I validate user is NOT logged in', async () => {
			// TODO: Uncomment and test shortcut button visibility check
			// await assert(this.headerMenu.shortcutButton().isVisible()).toBeTruthy();
			await expect(this.loginButton()).toBeVisible();
			await expect(this.headerMenu.registerButton()).toBeVisible();
			await expect(this.headerMenu.myProfileButton()).not.toBeVisible();
			await expect(this.headerMenu.balance()).not.toBeVisible();
			await expect(this.headerMenu.depositButton()).not.toBeVisible();
		});
	}
	
}