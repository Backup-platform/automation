import test, { expect } from '../pages/utils/base.po';
import { Page } from '@playwright/test';


export class Banner {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	//Locators
	readonly skipHiThere = () => this.page.locator('.introjs-customskipbutton');
	readonly skipNewDesign = () => this.page.locator('.introjs-customskipbutton');
	readonly bannerNewDesign = () => this.page.locator(".introjs-tooltip-title") //.getByText('A New Universe Of Fun'); //this.page.getByRole('heading', { name: 'A New Universe Of Fun' });
	readonly bannerHiThere = () => this.page.locator(".introjs-tooltip-title") //.getByText('Hi There!');//this.page.getByRole('heading', { name: 'Hi There!' });

	//Actions
	public async randomBannerNewDesign(): Promise<void> {
		await test.step('Click skip new design if visible', async () => {
			await this.page.addLocatorHandler( this.bannerNewDesign(), 
			async () => {
				await this.skipNewDesign().click();
			});
		});
	}

	public async randomBannerHiThere(): Promise<void> {
		await test.step('Click skip Hi there if visible', async () => {
			await this.page.addLocatorHandler( this.bannerHiThere(), async () => {
				await this.skipHiThere().click();
			});
		});
	}

}