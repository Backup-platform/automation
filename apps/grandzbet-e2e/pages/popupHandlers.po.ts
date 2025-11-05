import { Page } from '@playwright/test';
import { step } from '@test-utils/decorators';


export class PopupHandlers {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	//Locators
	readonly termsOfService = () => this.page.locator('#toc-sheet');
    readonly tosAcceptButton = () => this.page.locator('#toc-sheet .button').nth(0);
    readonly tosDeclineButton = () => this.page.locator('#toc-sheet .button').nth(1);
	
	// Cookie consent - original version
	readonly cookieConsent = () => this.page.locator('[data-testid="cookie-banner"]');
	readonly cookieAcceptButton = () => this.page.locator('[data-testid="cookie-accept"]');
	
	// Cookie consent - new Radix UI dialog version
	readonly cookieDialog = () => this.page.locator('[role="dialog"][class*="sticky"][class*="bottom"]');
	readonly cookieDialogAcceptButton = () => this.cookieDialog().locator('button.bg-primary');
	readonly cookieDialogCloseButton = () => this.cookieDialog().locator('button[type="button"]');

	
	//Actions
	@step('I accept the terms of service')
	public async acceptTermsOfService(): Promise<void> {
		await this.page.addLocatorHandler(this.termsOfService(), async () => {
			await this.tosAcceptButton().click();
		}, {noWaitAfter: true, times: 2});
	}

	@step('I accept original cookie banner')
	public async acceptOriginalCookieBanner(): Promise<void> {
		await this.page.addLocatorHandler(this.cookieConsent(), async () => {
			await this.cookieAcceptButton().click();
		}, {noWaitAfter: true, times: 2});
	}

	@step('I accept new cookie dialog')
	public async acceptNewCookieDialog(): Promise<void> {
		await this.page.addLocatorHandler(this.cookieDialog(), async () => {
			await this.cookieDialogAcceptButton().click();
		}, {noWaitAfter: true, times: 2});
	}

	@step('I accept cookie consent')
	public async acceptCookieConsent(): Promise<void> {
		await this.acceptOriginalCookieBanner();
		await this.acceptNewCookieDialog();
	}

	@step('I handle all popups')
	public async handleAllPopups(): Promise<void> {
		await this.acceptTermsOfService();
		await this.acceptCookieConsent();
	}
}