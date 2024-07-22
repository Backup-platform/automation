import test, { expect } from '../pages/utils/base.po';
import { Page } from '@playwright/test';


export class Banner {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	//Locators //
	readonly skipHiThere = () => this.page.locator('.introjs-customskipbutton');
	readonly skipNewDesign = () => this.page.locator('.introjs-customskipbutton');
	readonly bannerNewDesign = () => this.page.locator(".introjs-tooltip-title") //.getByText('A New Universe Of Fun'); //this.page.getByRole('heading', { name: 'A New Universe Of Fun' });
	readonly bannerHiThere = () => this.page.locator(".introjs-tooltip-title") //.getByText('Hi There!');//this.page.getByRole('heading', { name: 'Hi There!' });
	readonly escapeOptIn = () => this.page.locator(".inbox .close-btn");
	readonly optIn = () => this.page.locator(".inbox");
	readonly skipButtonSomething = () => this.page.locator(".introjs-button.introjs-customskipbutton");
	readonly bannerSomething = () => this.page.locator(".introjs-tooltip.introjs-user-home-desktop-first-step").or(this.page.locator(".introjs-guest-home-mobile-first-step.introjs-tooltip"));
	readonly sideBanner = () => this.page.locator('.small-notifications-wrapper');
	readonly sideBannerCloseBtn = () => this.page.locator('.small-notifications-wrapper .close-btn');
	
	//Actions
	public async randomBannerNewDesign(): Promise<void> {
		await test.step('Click skip new design if visible', async () => {
			await this.page.addLocatorHandler(this.bannerNewDesign(),
				async () => {
					await this.skipNewDesign().click();
				});
		});
	}

	public async randomClickEscape() {
		await test.step('Click escape in OptIn', async () => {
			await this.page.addLocatorHandler(this.optIn(),
				async () => {
					await this.escapeOptIn().click();
				});
		});
	}

	public async randomClickSkipSomething() {
		await test.step('Click skip in Something', async () => {
			await this.page.addLocatorHandler(this.bannerSomething(),
				async () => {
					await this.skipButtonSomething().click();
				});
		});
	}

	public async sideBannerClickCloseBtn() {
		await test.step('Click close button on the side banner', async () => {
			await this.page.addLocatorHandler(this.sideBanner(),
				async () => {
					var countRows = await this.sideBannerCloseBtn().count();
					for(var i = 0; i < countRows; ++i ){
						await this.sideBannerCloseBtn().nth(i).click();
					}
				});
		});
	}

	public async randomBannerHiThere(): Promise<void> {
		await test.step('Click skip Hi there if visible', async () => {
			await this.page.addLocatorHandler(this.bannerHiThere(), async () => {
				await this.skipHiThere().click();
			});
		});
	}

}