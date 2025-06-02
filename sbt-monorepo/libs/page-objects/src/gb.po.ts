import { Locator, Page } from '@playwright/test';

export class Gb {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

    private readonly register = () => this.page.locator('.shadow-header .bg-primary');
	private readonly login = () => this.page.locator('.shadow-header .bg-secondary-secondary');
	private readonly searchImage = () => this.page.locator('.pointer-events-auto svg');
	private readonly searchButton = () => this.page.locator('.ml-auto .relative input');


    private readonly vip = () => this.page.locator('.lg\:flex a[href="/vip"]');
    private readonly promotions = () => this.page.locator('.lg\:flex a[href="/promotions"]');
    private readonly sportsBetting = () => this.page.locator('.lg\:flex a[href="/sports-betting#/live"]');
    private readonly sportsBettingOverview = () => this.page.locator('.lg\:flex a[href="/sports-betting#/overview"]');
    private readonly liveCasino = () => this.page.locator('.lg\:flex a[href="/games/live-casino"]');
    private readonly casino = () => this.page.locator('.lg\:flex a[href="/games"]');
    private readonly menuButton = () => this.page.locator('.shadow-header button.bg-tertiary-secondary.lg\:flex');

    gbIcon = () => this.page.locator('a[href="/"]');

}