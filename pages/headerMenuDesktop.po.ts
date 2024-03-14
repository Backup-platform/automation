import { Page } from '@playwright/test';
import test, { expect } from '../pages/utils/base.po';

export class HeaderMenuDesktop {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	//Locators
	readonly sfLogoOld = () => this.page.locator('img[title=\'spacefortuna-logo\']');
	readonly desktopHeader = () => this.page.locator('#header #desktop-header');
	readonly shortcutButtonOld = () => this.page.locator('#shortcut-btn-shortcut');
	readonly shortcutButton = () => this.page.getByRole('button', { name: 'shortcut' });
	readonly gamesOld = () => this.page.locator('#desktop-nav-link-Games');
	readonly providersDropdown = () => this.page.locator('#providers-filter-btn');
	readonly myProfileIcon = () => this.page.locator('#desktop-profile-icon');
	readonly myProfile = () => this.page.getByText('My ProfileMy');
	readonly balance = () => this.page.getByText('Balance:');
	readonly crash = () => this.page.getByRole('link', { name: 'Crash' });
	readonly live = () => this.page.getByRole('link', { name: 'Live' });
	readonly home = () => this.page.getByRole('link', { name: 'Home' });
	readonly games = () => this.page.getByRole('link', { name: 'Games' });
	readonly promotions = () => this.page.locator('#desktop-nav-link-Promotions');
	readonly VIP = () => this.page.getByRole('link', { name: 'VIP', exact: true });
	readonly deposit = () => this.page.getByRole('button', { name: 'Deposit' });
	readonly sfLogo = () => this.page.getByRole('link', { name: 'SpaceFortuna Logo' });


	//Actions
	async clickGames(): Promise<void> {
		await this.games().click();
	}

	public async validateLogoVisible(): Promise<void> {
		await expect(this.sfLogo()).toBeVisible();
	}

	public async validateDesktopHeaderVisible(): Promise<void> {
		await expect(this.desktopHeader()).toBeVisible();

		await this.validateMyProfileVisible();
		await this.validateShortcutVisible();
		await this.validateGamesButtonVisible();
		await this.validateBalanceVisible();
		await this.validateCrashVisible();
		await this.validateLiveVisible();
		await this.validateHomeVisible();
		await this.validatePromotionsVisible();
		await this.validateVIPVisible();
		await this.validateDepositVisible();
	}

	public async validateMyProfileVisible() {
		await expect(this.myProfile()).toBeVisible({ timeout: 15000 });
	}

	public async validateShortcutVisible(): Promise<void> {
		await expect(this.shortcutButton()).toBeVisible();
	}

	public async validateGamesButtonVisible(): Promise<void> {
		await expect(this.games()).toBeVisible();
	}

	public async validateBalanceVisible(): Promise<void> {
		await expect(this.balance()).toBeVisible();
	}

	public async validateCrashVisible(): Promise<void> {
		await expect(this.crash()).toBeVisible();
	}

	public async validateLiveVisible(): Promise<void> {
		await expect(this.live()).toBeVisible();
	}

	public async validateHomeVisible(): Promise<void> {
		await expect(this.home()).toBeVisible();
	}

	public async validatePromotionsVisible(): Promise<void> {
		await expect(this.promotions()).toBeVisible();
	}

	public async validateVIPVisible(): Promise<void> {
		await expect(this.VIP()).toBeVisible();
	}

	public async validateDepositVisible(): Promise<void> {
		await expect(this.deposit()).toBeVisible();
	}

	public async validateSfLogoVisible(): Promise<void> {
		await expect(this.sfLogo()).toBeVisible();
	}


}