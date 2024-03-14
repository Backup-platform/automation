import test, { expect } from '../pages/utils/base.po';
import { Page } from '@playwright/test';


export class Banner {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	//Locators
	readonly skipHiThere = () => this.page.locator('a.introjs-button:nth-child(1)');
	readonly skipNewDesign = () => this.page.locator('a.introjs-button:nth-child(1)');
	readonly bannerNewDesign = () => this.page.getByRole('heading', {name: 'A New Universe Of Fun'});
	readonly bannerHiThere = () => this.page.getByRole('heading', {name: 'Hi There!'});

	//Actions
	public async randomBannerNewDesign(): Promise<void> {
		await this.page.addLocatorHandler(
			this.bannerNewDesign(), async () => {
				await this.skipNewDesign().click();
			});
	}
	
	public async randomBannerHiThere(): Promise<void> {
		await this.page.addLocatorHandler(
			this.bannerHiThere(), async () => {
				await this.skipHiThere().click();
			});
	}

}