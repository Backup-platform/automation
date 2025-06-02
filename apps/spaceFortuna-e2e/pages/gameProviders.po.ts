import { Page, Locator } from '@playwright/test';

export class GameProviders {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	static readonly providers = {
		man5: '#producer-5men',
		onlyPlay: '#producer-onlyplay',
		booming: '#producer-booming',
		fiveman: '#producer-5men',
		yggdrasil: '#producer-yggdrasil',
		reevo: '#producer-reevo'
	};

	//Locators
	readonly mobileProvidersDropdown = () => this.page.locator("#providers-filter-container");
	readonly providersDesktopDropdown = () => this.page.locator('#providers-filter-btn');
	readonly provButtonDesktop = () => this.page.locator('button[id="providers-filter-btn"]');
	readonly dropdownList = () => this.page.locator('div[class*="producersFilter_dropdown"] >.overflow-x-hidden');
	readonly pragmaticPlay = () => this.page.locator("#chk_Pragmatic Play");
	readonly playNGo = () => this.page.locator("#chk_Play'n GO");
	readonly apllyFiltersForProviders = () => this.page.locator('#apply-filters-btn');

	//Actions
	//TODO: use navigation class

	private async selectSpecificProvider(providers: string[]): Promise<void> {
		for (const provider of providers) {
			await this.page.locator(provider).click();
		}
	}

	public async selectDesktopProvidersFromDropdown(providers: string[]): Promise<void> {
		await this.providersDesktopDropdown().click();
		await this.selectSpecificProvider(providers);
	}

	public async clickApplyFiltersButton() : Promise<void> {
		await this.apllyFiltersForProviders().click();
	}

	public async selectMobileProvidersFromDropdown(providers: string[]): Promise<void> {
		await this.mobileProvidersDropdown().click();
		await this.selectSpecificProvider(providers);
		await this.clickApplyFiltersButton();
	}


	public async getPragmaticPlay(): Promise<Locator> {
		return this.pragmaticPlay();
	}

	public async getPlayNGo(): Promise<Locator> {
		return this.playNGo();
	}

}