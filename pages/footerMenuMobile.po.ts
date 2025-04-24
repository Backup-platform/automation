import { Page } from '@playwright/test';
import test, { expect } from '../pages/utils/base.po';
import { Navigation, step, stepParam } from './utils/navigation.po';

export class FooterMenuMobile {
	readonly page: Page;
	readonly navigation: Navigation;

	constructor(page: Page) {
		this.page = page;
		this.navigation = new Navigation(page);
	}

	//Locators
	readonly bottomNavMenu = () => this.page.getByLabel('loggedin');
	readonly shortcutButtonOld = () => this.page.locator('#shortcut-btn-shortcut');
	readonly shortcutButton = () => this.page.getByRole('button', { name: 'shortcut' });
	readonly gamesButtonOld = () => this.page.locator('button[href="/games/all"]');
	readonly gamesButton = () => this.page.getByRole('button', { name: 'Games', exact: true });
	readonly headerLogo = () => this.page.locator('[title="spacefortuna-logo"]');
	readonly balance = () => this.page.locator('[class*="homePageContent_mainWrapper_"] #wallet-current-balance');
	readonly depositButton = () => this.page.locator('a[href*="openCashier=true"] button');
	
	//Actions
	public async validateLogoVisible(): Promise<void> {
		await this.navigation.assertVisible(this.headerLogo(), false, 'Header Logo');
	}

	public async validateBottomNavMenuVisible(): Promise<void> {
		await this.navigation.assertVisible(this.bottomNavMenu(), false, 'Bottom Nav Menu');
	}

	public async validateBottomNavVisible(): Promise<void> {
		await this.validateBottomNavMenuVisible();
		await this.validateGamesVisible();
		await this.validateShortcutVisible();
		await this.validateBalanceVisible();
		await this.validateDepositButtonVisible();
	}

	public async validateDepositButtonVisible(): Promise<void> {
		await this.navigation.assertVisible(this.depositButton(), false, 'Deposit button');
	}

	public async validateBalanceVisible(): Promise<void> {
		await this.navigation.assertVisible(this.balance(), false, 'Balance');
	}

	public async validateShortcutVisible(): Promise<void> {
		await this.navigation.assertVisible(this.shortcutButton(), false, 'Shortcut button');
	}

	public async validateGamesVisible(): Promise<void> {
		await this.navigation.assertVisible(this.gamesButton(), false, 'Games button');
	}

	public async clickGames(): Promise<void> {
		await this.navigation.clickElement(this.gamesButton(), false, 'Games button');
	}

	@step(`I get the wallet balance amount`)
	public async getWalletBalance(): Promise<number> {
		return parseFloat(await this.balance().innerText());
	}

	public async clickDepositButton(): Promise<void> {
		await this.navigation.clickElement(this.depositButton(), false, 'Deposit button');
	}
}