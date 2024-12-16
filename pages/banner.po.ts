import test, { expect } from '../pages/utils/base.po';
import { Page } from '@playwright/test';
import { Navigation, step } from '../pages/utils/navigation.po';


export class Banner {
	readonly page: Page;
	readonly navigation: Navigation;

	constructor(page: Page) {
		this.page = page;
		this.navigation = new Navigation(page)
	}

	//Locators //
	readonly skipHiThere = () => this.page.locator('.introjs-customskipbutton');
	readonly skipNewDesign = () => this.page.locator('.introjs-customskipbutton');
	readonly bannerNewDesign = () => this.page.locator(".introjs-tooltip-title") //.getByText('A New Universe Of Fun'); //this.page.getByRole('heading', { name: 'A New Universe Of Fun' });
	readonly bannerHiThere = () => this.page.locator(".introjs-tooltip-title") //.getByText('Hi There!');//this.page.getByRole('heading', { name: 'Hi There!' });
	readonly escapeOptIn = () => this.page.locator(".inbox .close-btn");
	readonly optIn = () => this.page.locator(".inbox");
	readonly skipButtonSomething = () => this.page.locator(".introjs-button.introjs-customskipbutton");
	readonly bannerGuestSomething = () => this.page.locator(".introjs-tooltip.introjs-guest-home-desktop-first-step").or(this.page.locator(".introjs-guest-home-mobile-first-step.introjs-tooltip"));
	readonly bannerUserSomething = () => this.page.locator(".introjs-tooltip.introjs-user-home-desktop-first-step").or(this.page.locator(".introjs-user-home-mobile-first-step.introjs-tooltip"));
	readonly bannerSomething = () => this.bannerUserSomething().or(this.bannerGuestSomething());
	//readonly sideBanner = () => this.page.locator('.small-notifications-wrapper');
	readonly sideBanner2 = () => this.page.locator('#notification-small #ft-notification-type-message');	
	readonly sideBannerCloseBtn = () => this.page.locator('.small-notifications-wrapper .close-btn');
	readonly cookiesContainer = () => this.page.locator('div[class*="cookies_cookiesContainer_"]');
	readonly cookiesAcceptButton = () => this.page.locator('button[class*="cookies_cookiesAcceptBtn_"]');
	
	//Actions
	@step('I click skip new design')
	public async randomBannerNewDesign(): Promise<void> {
		await this.page.addLocatorHandler(this.bannerNewDesign(), async () => {
			await this.skipNewDesign().click();
			//await this.bannerNewDesign().waitFor({state: 'hidden'});
		});
	}

	@step('I clic the accept cookies button')
	public async acceptCookies(): Promise<void> {
		await this.page.addLocatorHandler(this.cookiesContainer(), async () => {
			await this.navigation.clickElement(this.cookiesAcceptButton(), false, 'Accept cookies');
			//await this.cookiesContainer().waitFor({state: 'hidden'});
		});
	}

	@step('I click escape in OptIn')
	public async clickEscapeInOptIn() {
		await this.page.addLocatorHandler(this.optIn(), async () => {
			await this.escapeOptIn().click();
				//await this.optIn().waitFor({state: 'hidden'});
		});
	}

	@step('I click skip in Something')
	public async randomClickSkipSomething() {
		await this.page.addLocatorHandler(this.bannerUserSomething().or(this.bannerGuestSomething()),
			async () => {
				const currentBanner = () => this.bannerUserSomething().or(this.bannerGuestSomething());
				await this.skipButtonSomething().click();
				//await currentBanner().waitFor({state: 'hidden'});
				//await this.bannerSomething().waitFor({state: 'hidden'});
			});
	}

	@step('I click close button in side banner')
	public async sideBannerClickCloseBtn() {
		await this.page.addLocatorHandler(this.sideBanner2(), async () => {
			var countRows = await this.sideBannerCloseBtn().count();
			for (var i = 0; i < countRows; ++i) {
				await this.sideBannerCloseBtn().nth(i).click();
				await this.sideBanner2().waitFor({ state: 'hidden' });
			}
		});
	}

	@step('I click skip Hi there')
	public async randomBannerHiThere(): Promise<void> {
		await this.page.addLocatorHandler(this.bannerHiThere(), async () => {
			await this.skipHiThere().click();
			//await this.bannerHiThere().waitFor({state: 'hidden'});
		});
	}

}