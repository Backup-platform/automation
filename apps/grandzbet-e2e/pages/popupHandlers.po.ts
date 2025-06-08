import { Page } from '@playwright/test';
import { step } from '@test-utils/navigation.po';


export class PopupHandlers {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	//Locators
	readonly termsOfService = () => this.page.locator('#toc-sheet');
    readonly tosAcceptButton = () => this.page.locator('#toc-sheet .button').nth(0);
    readonly tosDeclineButton = () => this.page.locator('#toc-sheet .button').nth(1);
	readonly cookieConsent = () => this.page.locator('[data-testid="cookie-banner"]');
	readonly cookieAcceptButton = () => this.page.locator('[data-testid="cookie-accept"]');

	
	//Actions
	@step('I accept the terms of service')
	public async acceptTermsOfService(): Promise<void> {
		await this.page.addLocatorHandler(this.termsOfService(), async () => {
			await this.tosAcceptButton().click();
			await this.termsOfService().waitFor({state: 'hidden'});
		});
	}

	@step('I accept cookie consent')
	public async acceptCookieConsent(): Promise<void> {
		await this.page.addLocatorHandler(this.cookieConsent(), async () => {
			await this.cookieAcceptButton().click();
			await this.cookieConsent().waitFor({state: 'hidden'});
		});
	}

	@step('I handle all popups')
	public async handleAllPopups(): Promise<void> {
		await this.acceptTermsOfService();
		await this.acceptCookieConsent();
	}
}